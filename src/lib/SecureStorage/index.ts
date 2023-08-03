import * as Keychain from 'react-native-keychain';
import {
  getAllGenericPasswordServices,
  resetGenericPassword,
  Result as KeychainResult,
} from 'react-native-keychain';
import { decryptData, encryptData, EncryptedData } from 'lib/EncryptionUtils';
import { SerializableWallet, Wallet } from 'types/wallet';
import { serializeWallet } from 'lib/WalletUtils/serialize';
import { deserializeWallet } from 'lib/WalletUtils/deserialize';
import { BiometricAuthorizations } from 'types/settings';
import { err, ok, Result, ResultAsync } from 'neverthrow';
import {
  CorruptedDataError,
  EncryptionFailedError,
  InvalidPasswordError,
  SecureStorageError,
  UnknownSecureStorageError,
  WalletNotFoundError,
} from 'lib/SecureStorage/errors';

export enum SecureStorageKeys {
  /**
   * Key used to store the user password encrypted with the
   * user biometrics.
   */
  BIOMETRIC_AUTHORIZATION_SUFFIX = '_BIOMETRIC_AUTHORIZATION',
  WALLET_SUFFIX = '_WALLET',
  PASSWORD_CHALLENGE = 'PASSWORD_CHALLENGE',
}

const passwordChallenge = 'dpm-password-challenge';

const defaultOptions: Keychain.Options = {
  authenticationPrompt: {
    title: 'Biometric Authentication',
  },
  accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
};

/**
 * Options used to configure how the data will be stored into the device.
 */
export interface StoreOptions {
  /**
   * The password used to cipher the data.
   */
  password?: string;
  /**
   * Tells if the data should be linked to the user's biometric information.
   */
  biometrics?: boolean;
}

/**
 * Gets an item from the storage.
 * @param key Item key.
 * @param options Options to describe how the data are stored into the device storage.
 */
async function getItem<T>(
  key: string,
  options: StoreOptions | undefined = undefined,
): Promise<Result<T | undefined, SecureStorageError>> {
  const moreOptions = options?.biometrics === true ? { ...defaultOptions } : null;

  const getDataResult = await ResultAsync.fromPromise(
    Keychain.getGenericPassword({
      service: key,
      ...moreOptions,
    }),
    (e) => new UnknownSecureStorageError(`error while getting data ${e}`),
  );

  if (getDataResult.isErr()) {
    return err(getDataResult.error);
  }

  const data = getDataResult.value;

  if (!data) {
    return ok(undefined);
  }

  // By default, if the password is not provided, the data is stored as a plain text
  let serializedData = data.password;

  // Password provided, decrypt the data
  if (options?.password !== undefined) {
    // Get the password to be used to decrypt the data
    const jsonValueNew = JSON.parse(data.password);
    if (typeof jsonValueNew.iv !== 'string' && typeof jsonValueNew.cipher !== 'string') {
      return err(new CorruptedDataError());
    }

    // Decrypt the data
    const result = await decryptData(jsonValueNew as EncryptedData, options.password);
    if (result.isErr()) {
      if (result.error.message.indexOf('BAD_DECRYPT') !== 0) {
        return err(new InvalidPasswordError());
      }
      return err(new UnknownSecureStorageError(result.error.message));
    }
    serializedData = result.value;
  }

  // Deserialize the data
  return ok(JSON.parse(serializedData));
}

/**
 * Inserts/Updates an item into the storage.
 * @param key Item key.
 * @param value Value to insert into the storage.
 * @param options Options to describe how the data will be stored into the device storage.
 */
async function setItem<T>(
  key: string,
  value: T,
  options: StoreOptions | undefined = undefined,
): Promise<Result<KeychainResult, SecureStorageError>> {
  const moreOptions = options?.biometrics === true ? { ...defaultOptions } : null;

  let data = JSON.stringify(value);

  // Password provided, encrypt the data.
  if (options?.password !== undefined) {
    const result = await encryptData(data, options.password);
    if (result.isErr()) {
      return err(new EncryptionFailedError(result.error.message));
    }

    data = JSON.stringify(result.value);
  }

  try {
    const storeResult = await Keychain.setGenericPassword('dpm', data, {
      service: key,
      ...moreOptions,
    });
    if (!storeResult) {
      return err(new UnknownSecureStorageError('Unknown error while storing the data'));
    }
    return ok(storeResult);
  } catch (e: any) {
    return err(new UnknownSecureStorageError(e?.message ?? 'Unknown error while storing the data'));
  }
}

export async function deleteItem(key: string): Promise<boolean> {
  return resetGenericPassword({ service: key });
}

export async function resetSecureStorage(): Promise<void> {
  const keys = await getAllGenericPasswordServices();
  await Promise.all(keys.map(async (key) => resetGenericPassword({ service: key })));
}

/**
 * Stores the given {@param wallet} into the device storage encrypted with the given {@param password}.
 */
async function storeWallet(
  wallet: SerializableWallet,
  password: string,
): Promise<Result<void, SecureStorageError>> {
  const result = await setItem(`${wallet.address}${SecureStorageKeys.WALLET_SUFFIX}`, wallet, {
    password,
  });

  return result.map(() => undefined);
}

/**
 * Saves a wallet into the device storage.
 * @param wallet - Wallet instance to save.
 * @param password - Password to protect the wallet.
 */
export const saveWallet = async (
  wallet: Wallet,
  password: string,
): Promise<Result<void, SecureStorageError>> => {
  const serializableWallet = serializeWallet(wallet);
  return storeWallet(serializableWallet, password);
};

const getWalletKey = (address: string) => `${address}${SecureStorageKeys.WALLET_SUFFIX}`;

/**
 * Saves a wallet into the device storage.
 * @param address - Address of the wallet to delete.
 */
export const deleteWallet = async (address: string) => {
  const key = getWalletKey(address);
  deleteItem(key);
};

/**
 * Gets a wallet from the device storage.
 * @param address - Address of the wallet to load.
 * @param password - Password used to protect the wallet.
 */
export const getWallet = async (
  address: string,
  password: string,
): Promise<Result<SerializableWallet, SecureStorageError>> => {
  const key = getWalletKey(address);
  const result = await getItem<Partial<SerializableWallet>>(key, { password });
  if (result.isErr()) {
    return err(result.error);
  }

  // Read the value from the result
  const { value } = result;
  if (!value) {
    return err(new WalletNotFoundError(address));
  }

  // Return the deserialized wallet
  return ok(deserializeWallet(value));
};

/**
 * Sets the given password as the password that the user will use in order to
 * confirm transactions and unlock their wallet.
 * @param password {string} - Value of the password to be set.
 * @throws Error if for some reason the encryption operations fail.
 */
export const setUserPassword = async (
  password: string,
): Promise<Result<void, SecureStorageError>> => {
  const result = await setItem<string>(SecureStorageKeys.PASSWORD_CHALLENGE, passwordChallenge, {
    password,
  });

  return result.map(() => undefined);
};

/**
 * Checks whether the given password is the same that was set by the user in order to unlock the wallet.
 * @param password {string} - Password to be checked.
 * @return {true} if the password matches the previous one, or {false} otherwise.
 * @throws Error if for some reason the decryption operations fail.
 */
export const checkUserPassword = async (password: string): Promise<boolean> => {
  const result = await getItem<string>(SecureStorageKeys.PASSWORD_CHALLENGE, { password });
  return result.unwrapOr(undefined) === passwordChallenge;
};

/**
 * Allows to change the password that is used in order to encrypt the wallets of the user.
 * @param oldPassword {String} - Old password currently used to encrypt the wallet.
 * @param newPassword {String} - New password that will be used to encrypt the wallet.
 * @return `true` if all the operations are performed successfully, `false` otherwise.
 * If `false` is returned, it means the input password is incorrect.
 * @throws {Error} if for some reason the decryption of encryption fails.
 */
export const changeWalletsPassword = async (
  oldPassword: string,
  newPassword: string,
): Promise<Result<void, SecureStorageError>> => {
  const isPasswordValid = await checkUserPassword(oldPassword);
  if (!isPasswordValid) {
    return err(new InvalidPasswordError());
  }

  // Get all the wallet addresses
  const services = await Keychain.getAllGenericPasswordServices();
  const walletAddresses = services
    .filter((key) => key.endsWith(SecureStorageKeys.WALLET_SUFFIX))
    .map((key) => key.replace(SecureStorageKeys.WALLET_SUFFIX, ''));

  // Decrypt and re-encrypt all the wallets with the new password
  // It's fine to disable the no-restricted-syntax rule here because we using a foor loop makes the
  // code a lot more readable
  // eslint-disable-next-line no-restricted-syntax
  for (const address of walletAddresses) {
    // Decode the wallet with the old password
    // It's important to disable the no-await-in-loop rule here because we need to wait for the result
    // eslint-disable-next-line no-await-in-loop
    const walletResult = await getWallet(address, oldPassword);
    if (walletResult.isErr()) {
      return err(walletResult.error);
    }

    // Encode the wallet with the new password
    // It's important to disable the no-await-in-loop rule here because we need to wait for the result
    // eslint-disable-next-line no-await-in-loop
    const storeResult = await storeWallet(walletResult.value, newPassword);
    if (storeResult.isErr()) {
      return err(storeResult.error);
    }
  }

  // Update the global password challenge
  const passwordResult = await setUserPassword(newPassword);
  if (passwordResult.isErr()) {
    return err(passwordResult.error);
  }

  // Update the configured biometrics configurations with the new password.
  const allKeys = await Keychain.getAllGenericPasswordServices();
  const biometricsKeys = Object.values(BiometricAuthorizations).map(
    (auth) => `${auth}${SecureStorageKeys.BIOMETRIC_AUTHORIZATION_SUFFIX}`,
  );
  const biometricsToUpdate = allKeys.filter((key) => biometricsKeys.indexOf(key) !== -1);

  // It's fine to disable the no-restricted-syntax rule here because we using a foor loop makes the
  // code a lot more readable
  // eslint-disable-next-line no-restricted-syntax
  for (const key of biometricsToUpdate) {
    // It's important to disable the no-await-in-loop rule here because we need to wait for the result
    // eslint-disable-next-line no-await-in-loop
    const result = await setItem(key, newPassword, { biometrics: true });
    if (result.isErr()) {
      return err(result.error);
    }
  }

  return ok(undefined);
};

export const storeBiometricAuthorization = async (
  authorizationType: BiometricAuthorizations,
  password: string,
): Promise<Result<void, SecureStorageError>> => {
  const isPasswordValid = await checkUserPassword(password);
  if (!isPasswordValid) {
    return err(new InvalidPasswordError());
  }

  await setItem(
    `${authorizationType}${SecureStorageKeys.BIOMETRIC_AUTHORIZATION_SUFFIX}`,
    password,
    {
      biometrics: true,
    },
  );

  return ok(undefined);
};

const getBiometricAuthorizationKey = (authorizationType: BiometricAuthorizations) =>
  `${authorizationType}${SecureStorageKeys.BIOMETRIC_AUTHORIZATION_SUFFIX}`;

/**
 * Delete the password protected with biometric for the provided [BiometricAuthorizations].
 */
export const deleteBiometricAuthorization = async (
  authorizationType: BiometricAuthorizations,
): Promise<Result<void, SecureStorageError>> => {
  const key = getBiometricAuthorizationKey(authorizationType);

  // Get the item first to force the user to authenticate before delete.
  const result = await getItem(key, { biometrics: true });
  if (result.isErr()) {
    return err(result.error);
  }

  // Delete the item
  await deleteItem(key);
  return ok(undefined);
};

/**
 * Get the password protected with biometric for the provided [BiometricAuthorizations].
 * @param authorizationType {BiometricAuthorizations} - The type of biometric authorization.
 */
export const getBiometricPassword = async (authorizationType: BiometricAuthorizations) => {
  const key = getBiometricAuthorizationKey(authorizationType);
  const result = await getItem<string>(key, { biometrics: true });
  return result.unwrapOr(undefined);
};

/**
 * Checks if the keychain has been initialized.
 */
export const isKeyChainInitialized = async (): Promise<boolean> => {
  const result = await getItem(SecureStorageKeys.PASSWORD_CHALLENGE);
  return result.unwrapOr(undefined) !== undefined;
};
