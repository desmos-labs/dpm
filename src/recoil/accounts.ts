import { atom, selector } from 'recoil';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { Account } from 'types/account';
import { HdPath } from '@cosmjs/crypto';
import { WalletType } from 'types/wallet';

/**
 * An atom that holds all the accounts stored in the application.
 */
export const accountsAppState = atom<Record<string, Account>>({
  key: 'accounts',
  default: getMMKV(MMKVKEYS.ACCOUNTS) || {},
  effects: [
    ({ onSet }) => {
      onSet((newAccounts) => {
        setMMKV(MMKVKEYS.ACCOUNTS, newAccounts);
      });
    },
  ],
});

/**
 * An atom that holds all the accounts addresses.
 */
export const accountsHdPathsAppState = selector<HdPath[]>({
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
