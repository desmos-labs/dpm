import { MMKV } from 'react-native-mmkv';

const WCMMKVStorage = new MMKV({
  id: 'wallet-connect-mmkv-id',
});

export async function getEntries<T = any>(): Promise<[string, T][]> {
  return WCMMKVStorage.getAllKeys().map((key) => [
    key,
    JSON.parse(WCMMKVStorage.getString(key) ?? '{}'),
  ]);
}

export async function getItem<T = any>(key: string): Promise<T | undefined> {
  const value = WCMMKVStorage.getString(key);
  return value !== undefined ? JSON.parse(value) : undefined;
}

export async function getKeys(): Promise<string[]> {
  return WCMMKVStorage.getAllKeys();
}

export async function removeItem(key: string): Promise<void> {
  WCMMKVStorage.delete(key);
}

export async function setItem<T = any>(key: string, value: T): Promise<void> {
  WCMMKVStorage.set(key, JSON.stringify(value));
}

export function clearAll() {
  WCMMKVStorage.clearAll();
}
