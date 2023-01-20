import React from 'react';
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { Account } from 'types/account';
import { deserializeAccounts } from 'lib/AccountUtils/deserialize';
import { serializeAccounts } from 'lib/AccountUtils/serialize';

/**
 * An atom that holds all the accounts stored in the application.
 */
export const accountsAppState = atom<Record<string, Account>>({
  key: 'accounts',
  default: deserializeAccounts(getMMKV(MMKVKEYS.ACCOUNTS), {}),
  effects: [
    ({ onSet }) => {
      onSet((newAccounts) => {
        setMMKV(MMKVKEYS.ACCOUNTS, serializeAccounts(newAccounts));
      });
    },
  ],
});

/**
 * An atom that holds all the accounts addresses.
 */
const accountsAddressesAppState = selector<string[]>({
  key: 'accountsAddresses',
  get: ({ get }) => {
    const accounts = get(accountsAppState);
    return Object.values(accounts).map((account) => account.address);
  },
});

/**
 * Hook that allows to get the currently stored accounts HD paths.
 */
export const useGetAccountsAddresses = () => useRecoilValue(accountsAddressesAppState);

/**
 * Hook that allows to store a new account inside the app state.
 */
export const useStoreAccount = () => {
  const [, setAccounts] = useRecoilState(accountsAppState);
  return React.useCallback(
    (account: Account) => {
      setAccounts((curValue) => {
        const newValue: Record<string, Account> = {
          ...curValue,
        };
        newValue[account.address] = account;
        return newValue;
      });
    },
    [setAccounts],
  );
};

/**
 * Recoil select that allows to easily know if there is at least one account stored in the device or not.
 */
const hasAccountAppState = selector({
  key: 'hasAccount',
  get: ({ get }) => {
    const accounts = get(accountsAppState);
    return Object.keys(accounts).length > 0;
  },
});

/**
 * Hook that allows to easily know if there is at least one account stored inside the device or not.
 */
export const useHasAccount = () => useRecoilValue(hasAccountAppState);

/**
 * Hook that allows to get the accounts stored on the device.
 */
export const useGetAccounts = () => useRecoilValue(accountsAppState);

/**
 * Hook that allows to update the accounts stored on the device.
 */
export const useSetAccounts = () => useSetRecoilState(accountsAppState);
