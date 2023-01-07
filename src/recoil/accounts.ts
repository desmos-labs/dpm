import React from 'react';
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { Account } from 'types/account';
import { HdPath } from '@cosmjs/crypto';
import { WalletType } from 'types/wallet';
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
const accountsHdPathsAppState = selector<HdPath[]>({
  key: 'accountsAddresses',
  get: ({ get }) => {
    const accounts = get(accountsAppState);
    return Object.values(accounts)
      .map((account) => {
        if (
          account.walletType === WalletType.Ledger ||
          account.walletType === WalletType.Mnemonic
        ) {
          return account.hdPath;
        }
        return null;
      })
      .filter((value) => value !== null) as HdPath[];
  },
});

/**
 * Hook that allows to get the currently stored accounts HD paths.
 */
export const useGetAccountsHDPaths = () => useRecoilValue(accountsHdPathsAppState);

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
 * Hook that allows to get the accounts stored on the device.
 */
export const useGetAccounts = () => useRecoilValue(accountsAppState);
