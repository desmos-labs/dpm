import * as Keychain from 'react-native-keychain';
import { getAllGenericPasswordServices, resetGenericPassword, Result } from 'react-native-keychain';
import { decryptData, encryptData, EncryptedData } from 'lib/EncryptionUtils';
import { SerializableWallet, Wallet } from 'types/wallet';
import { serializeWallet } from 'lib/WalletUtils/serialize';
import { deserializeWallet } from 'lib/WalletUtils/deserialize';
import { BiometricAuthorizations } from 'types/settings';

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
export async function getItem<T>(
  key: string,
  options: StoreOptions | undefined = undefined,
): Promise<T | null> {
  const moreOptions = options?.biometrics === true ? { ...defaultOptions } : null;

  const data = await Keychain.getGenericPassword({
    service: key,
    ...moreOptions,
  });

  if (!data) {
    return null;
  }

  let jsonSerialized = data.password;

  // Password provided, decrypt the data
  if (options?.password !== undefined) {
    const jsonValueNew = JSON.parse(data.password);
    if (typeof jsonValueNew.iv !== 'string' && typeof jsonValueNew.cipher !== 'string') {
      throw new Error('Invalid encrypted data');
    } else {
      jsonSerialized = await decryptData(jsonValueNew as EncryptedData, options.password);
    }
  }

  return JSON.parse(jsonSerialized);
}

/**
 * Inserts/Updates an item into the storage.
 * @param key Item key.
 * @param value Value to insert into the storage.
 * @param options Options to describe how the data will be stored into the device storage.
 */
export async function setItem<T>(
  key: string,
  value: T,
  options: StoreOptions | undefined = undefined,
): Promise<false | Result> {
  const moreOptions = options?.biometrics === true ? { ...defaultOptions } : null;

  let data = JSON.stringify(value);

  // Password provided, encrypt the data.
  if (options?.password !== undefined) {
    const encryptedData = await encryptData(data, options.password);
    data = JSON.stringify(encryptedData);
  }

  return Keychain.setGenericPassword('dpm', data, {
    service: key,
    ...moreOptions,
  });
}

export async function turnOnBiometrics(
  key: string,
  password: string,
): Promise<false | Result | null> {
  const passwordKey = await getItem('dpm_global_password');
  if (passwordKey === 'dpm_global_password') {
    return setItem(key, password, { password, biometrics: true });
  }
  return null;
}

export async function deleteItem(key: string): Promise<boolean> {
  return resetGenericPassword({ service: key });
}

export async function resetSecureStorage(): Promise<void> {
  const keys = await getAllGenericPasswordServices();
  await Promise.all(keys.map(async (key) => resetGenericPassword({ service: key })));
}

async function storeWallet(wallet: SerializableWallet, password: string) {
  const result = await setItem(`${wallet.address}${SecureStorageKeys.WALLET_SUFFIX}`, wallet, {
    password,
  });

  if (!result) {
    throw new Error(`error while saving wallet ${wallet.address}`);
  }
}

/**
 * Saves a wallet into the device storage.
 * @param wallet - Wallet instance to save.
 * @param password - Password to protect the wallet.
 */
export const saveWallet = async (wallet: Wallet, password: string) => {
  const serializableWallet = serializeWallet(wallet);
  await storeWallet(serializableWallet, password);
};

/**
 * Saves a wallet into the device storage.
 * @param address - Address of the wallet to delete.
 */
export const deleteWallet = async (address: string) =>
  deleteItem(`${address}${SecureStorageKeys.WALLET_SUFFIX}`);

/**
 * Gets a wallet from the device storage.
 * @param address - Address of the wallet to load.
 * @param password - Password used to protect the wallet.
 */
export const getWallet = async (address: string, password: string): Promise<SerializableWallet> => {
  const loadedValue = await getItem<Partial<SerializableWallet>>(
    `${address}${SecureStorageKeys.WALLET_SUFFIX}`,
    {
      password,
    },
  );

  if (loadedValue === null) {
    throw new Error(`can't find wallet for address: ${address}`);
  }

  return deserializeWallet(loadedValue);
};

/**
 * Sets the given password as the password that the user will use in order to
 * confirm transactions and unlock their wallet.
 * @param password {string} - Value of the password to be set.
 * @throws Error if for some reason the encryption operations fail.
 */
export const setUserPassword = async (password: string) => {
  const result = await setItem<string>(SecureStorageKeys.PASSWORD_CHALLENGE, passwordChallenge, {
    password,
  });

  if (!result) {
    throw new Error('error while storing the user password challenge');
  }
};

/**
 * Checks whether the given password is the same that was set by the user in order to unlock the wallet.
 * @param password {string} - Password to be checked.
 * @return {true} if the password matches the previous one, or {false} otherwise.
 * @throws Error if for some reason the decryption operations fail.
 */
export const checkUserPassword = async (password: string) => {
  let value: string | null;
  try {
    value = await getItem<string>(SecureStorageKeys.PASSWORD_CHALLENGE, {
      password,
    });
  } catch (e) {
    return false;
  }

  if (value === null) {
    throw new Error('error while loading the password challenge from storage');
  }

  return value === passwordChallenge;
};

/**
 * Allows to change the password that is used in order to encrypt the wallets of the user.
 * @param oldPassword {String} - Old password currently used to encrypt the wallet.
 * @param newPassword {String} - New password that will be used to encrypt the wallet.
 * @return `true` if all the operations are performed successfully, `false` otherwise.
 * If `false` is returned, it means the input password is incorrect.
 * @throws {Error} if for some reason the decryption of encryption fails.
 */
export const changeWalletsPassword = async (oldPassword: string, newPassword: string) => {
  const isPasswordValid = await checkUserPassword(oldPassword);
  if (!isPasswordValid) {
    return false;
  }

  // Get all the wallet addresses
  const services = await Keychain.getAllGenericPasswordServices();
  const walletAddresses = services
    .filter((key) => key.endsWith(SecureStorageKeys.WALLET_SUFFIX))
    .map((key) => key.replace(SecureStorageKeys.WALLET_SUFFIX, ''));

  // Decrypt and re-encrypt all the wallets with the new password
  const wallets = await Promise.all(walletAddresses.map((key) => getWallet(key, oldPassword)));
  await Promise.all(wallets.map((wallet) => storeWallet(wallet, newPassword)));

  // Update the global password challenge
  await setUserPassword(newPassword);
  return true;
};

export const storeBiometricAuthorization = async (
  authorizationType: BiometricAuthorizations,
  password: string,
) => {
  const isPasswordValid = await checkUserPassword(password);
  if (!isPasswordValid) {
    throw new Error('invalid user password');
  }

  await setItem(
    `${authorizationType}${SecureStorageKeys.BIOMETRIC_AUTHORIZATION_SUFFIX}`,
    password,
    {
      biometrics: true,
    },
  );
};

/**
 * Delete the password protected with biometric for the provided [BiometricAuthorizations].
 */
export const deleteBiometricAuthorization = async (authorizationType: BiometricAuthorizations) => {
  const key = `${authorizationType}${SecureStorageKeys.BIOMETRIC_AUTHORIZATION_SUFFIX}`;
  try {
    // Get the item first to force the user to authenticate before delete.
    await getItem(key, {
      biometrics: true,
    });
    await deleteItem(key);
    return true;
  } catch (e) {
    return false;
  }
};

export const getBiometricPassword = async (authorizationType: BiometricAuthorizations) => {
  try {
    const password = await getItem<string>(
      `${authorizationType}${SecureStorageKeys.BIOMETRIC_AUTHORIZATION_SUFFIX}`,
      {
        biometrics: true,
      },
    );

    return password ?? undefined;
  } catch (e) {
    return undefined;
  }
};
