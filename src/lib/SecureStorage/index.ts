import { getAllGenericPasswordServices, resetGenericPassword, Result } from 'react-native-keychain';
import * as Keychain from 'react-native-keychain';
import { decryptData, encryptData, EncryptedData } from 'lib/EncryptionUtils';
import { SerializableWallet, Wallet } from 'types/wallet';
import { serializeWallet } from 'lib/WalletUtils/serialize';
import { deserializeWallet } from 'lib/WalletUtils/deserialize';

export enum SECURE_STORAGE_KEYS {
  WALLET_SUFFIX = '_WALLET',
}

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

/**
 * Saves a wallet into the device storage.
 * @param wallet - Wallet instance to save.
 * @param password - Password to protect the wallet.
 */
export const saveWallet = async (wallet: Wallet, password: string) => {
  const serializableWallet = serializeWallet(wallet);

  const result = await setItem(`${wallet.address}${SECURE_STORAGE_KEYS.WALLET_SUFFIX}`, serializableWallet, {
    password,
  });

  if (!result) {
    throw new Error(`error while saving wallet ${wallet.address}`);
  }
};

/**
 * Gets a wallet from the device storage.
 * @param address - Address of the wallet to load.
 * @param password - Password used to protect the wallet.
 */
export const getWallet = async (address: string, password: string): Promise<SerializableWallet> => {
  const loadedValue = await getItem<Partial<SerializableWallet>>(`${address}${SECURE_STORAGE_KEYS.WALLET_SUFFIX}`, {
    password,
  });

  if (loadedValue === null) {
    throw new Error(`can't find wallet for address: ${address}`);
  }

  return deserializeWallet(loadedValue);
};
