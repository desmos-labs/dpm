import { atom, selector } from 'recoil';
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
