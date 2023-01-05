import { MMKV, useMMKVObject } from 'react-native-mmkv';

export enum MMKVKEYS {
  APP_SETTINGS = 'APP_SETTINGS',
  ACTIVE_ACCOUNT_ADDRESS = 'ACTIVE_ACCOUNT_ADDRESS',
  ACCOUNTS = 'ACCOUNTS',
}

const MMKVStorage = new MMKV({
  id: 'dpm-mmkv-id',
});

/**
 * Retrieve a value from MMKV and attempts to parse it into a json value.
 * If invalid, it will return undefined or the stored raw value.
 */
export const getMMKV = <T>(key: MMKVKEYS): T | undefined => {
  const mmkvValue = MMKVStorage.getString(key);

  if (!mmkvValue) return undefined;
  try {
    return JSON.parse(mmkvValue);
  } catch (err: any) {
    console.log(err);
    throw new Error(err.message);
  }
};

/**
 * Stringifies a value and writes it to a given MMKV key
 */
export const setMMKV = (key: MMKVKEYS, value: any) => MMKVStorage.set(key, JSON.stringify(value));

/**
 * Clear the whole MMKV storage
 */
export const clearMMKV = () => MMKVStorage.clearAll();

/**
 * Delete a value from MMKV by key
 */
export const deleteMMKV = (key: MMKVKEYS) => MMKVStorage.delete(key);

/**
 * A hook that wraps useMMKVObject to enforce MMKVKEYS enum usage.
 */
export const useMMKVStorage = <T>(key: MMKVKEYS) => useMMKVObject<T>(key, MMKVStorage);
