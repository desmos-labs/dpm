import { getAllGenericPasswordServices, resetGenericPassword, Result } from 'react-native-keychain';
import * as Keychain from 'react-native-keychain';
import {decryptData, encryptData, EncryptedData} from 'lib/EncryptionUtils';

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
export async function getItem(
  key: string,
  options: StoreOptions | undefined = undefined,
): Promise<string | null> {
  const moreOptions = options?.biometrics === true ? { ...defaultOptions } : null;
  const insertedWithoutPassword = await Keychain.getGenericPassword({
    service: key,
    ...moreOptions,
  });
  if (!insertedWithoutPassword) {
    return null;
  }

  if (options?.password !== undefined) {
    const insertedWithPassword = await Keychain.getGenericPassword({
      service: key,
      ...moreOptions,
    });
    if (insertedWithPassword) {
      const jsonValueNew = JSON.parse(insertedWithPassword.password);
      if (typeof jsonValueNew.iv !== 'string' && typeof jsonValueNew.cipher !== 'string') {
        throw new Error('Invalid encrypted data');
      } else {
        return decryptData(jsonValueNew as EncryptedData, options.password);
      }
    }
  }

  return insertedWithoutPassword.password;
}

/**
 * Inserts/Updates an item into the storage.
 * @param key Item key.
 * @param value Value to insert into the storage.
 * @param options Options to describe how the data will be stored into the device storage.
 */
export async function setItem(
  key: string,
  value: string,
  options: StoreOptions | undefined = undefined,
): Promise<false | Result> {
  const moreOptions = options?.biometrics === true ? { ...defaultOptions } : null;
  if (options?.password !== undefined) {
    const encryptedData = await encryptData(value, options.password);
    return Keychain.setGenericPassword('dpm', JSON.stringify(encryptedData), {
      service: key,
      ...moreOptions,
    });
  }
  return Keychain.setGenericPassword('dpm', value, {
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
