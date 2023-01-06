import { atom, selector } from 'recoil';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { Account } from 'types/account';
import { accountsAppState } from '@recoil/accounts';

/**
 * An atom that holds the current selected account address.
 */
export const activeAccountAddress = atom<string | undefined>({
  key: 'activeAccountAddress',
  default: getMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDRESS),
  effects: [
    ({ onSet }) => {
      onSet((newAddress) => {
        setMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDRESS, newAddress);
      });
    },
  ],
});

/**
 * Selector that provides the current selected account.
 */
export const activeAccountAppState = selector<Account | undefined>({
  key: 'activeAccount',
  get: ({ get }) => {
    const accounts = get(accountsAppState);
    const selectedAccountAddress = get(activeAccountAddress);

    if (selectedAccountAddress === undefined) {
      return undefined;
    }
    return accounts[selectedAccountAddress];
  },
});
