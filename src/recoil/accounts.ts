import React, { useCallback } from 'react';
import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { Account } from 'types/account';
import { deserializeAccounts } from 'lib/AccountUtils/deserialize';
import { serializeAccounts } from 'lib/AccountUtils/serialize';
import useIdentifyUser from 'hooks/analytics/useIdentifyUser';

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
 * Hook that allows to store a new account inside the app state.
 */
export const useStoreAccount = () => {
  const [, setAccounts] = useRecoilState(accountsAppState);
  const identifyUser = useIdentifyUser();

  return React.useCallback(
    (account: Account) => {
      setAccounts((curValue) => {
        const newValue: Record<string, Account> = {
          ...curValue,
        };
        newValue[account.address] = account;

        // Identify the user with the new stored accounts.
        identifyUser(Object.keys(newValue));

        return newValue;
      });
    },
    [setAccounts, identifyUser],
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
export const useStoredAccounts = () => useRecoilValue(accountsAppState);

/**
 * Selector that allows to easily get the number of stored accounts.
 */
const storedAccountsNumberAppState = selector({
  key: 'storedAccountsNumber',
  get: ({ get }) => {
    const accounts = get(accountsAppState);
    return Object.keys(accounts).length;
  },
});

/**
 * Hook that allows to easily get the number of stored accounts.
 */
export const useStoredAccountsNumber = () => useRecoilValue(storedAccountsNumberAppState);

/**
 * Hook that allows to easily delete the account of a user having a given address.
 */
export const useDeleteAccount = () => {
  const setAccounts = useSetRecoilState(accountsAppState);
  const identifyUser = useIdentifyUser();

  return useCallback(
    (address: string) => {
      setAccounts((storedAccounts) => {
        const newValue: Record<string, Account> = {
          ...storedAccounts,
        };
        delete newValue[address];

        // Identify the user with the new stored accounts.
        identifyUser(Object.keys(newValue));

        return newValue;
      });
    },
    [setAccounts, identifyUser],
  );
};

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
export const useStoredAccountsAddresses = () => useRecoilValue(accountsAddressesAppState);
