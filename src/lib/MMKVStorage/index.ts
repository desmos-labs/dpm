import { MMKV, useMMKVObject } from 'react-native-mmkv';
import { deserializeObject, serializeObject } from 'lib/MMKVStorage/encoding';

export enum MMKVKEYS {
  APP_SETTINGS = 'APP_SETTINGS',
  ACTIVE_ACCOUNT_ADDRESS = 'ACTIVE_ACCOUNT_ADDRESS',
  ACCOUNTS = 'ACCOUNTS',

  PROFILES_PARAMS = 'PROFILES_PARAMS',
  PROFILES = 'PROFILES',
  CHAIN_LINKS = 'CHAIN_LINKS',
  APPLICATION_LINKS = 'APPLICATION_LINKS',

  WALLET_CONNECT_SESSIONS = 'WALLET_CONNECT_SESSIONS',
  PERMISSIONS_REQUEST_COUNT = 'PERMISSIONS_REQUEST_COUNT',
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
    return deserializeObject(mmkvValue);
  } catch (err: any) {
    throw new Error(err.message);
  }
};

/**
 * Stringifies a value and writes it to a given MMKV key
 */
export const setMMKV = (key: MMKVKEYS, value: any) =>
  MMKVStorage.set(key, value ? serializeObject(value) : value);

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
