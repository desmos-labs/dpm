import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { Account } from 'types/account';
import { accountsAppState } from '@recoil/accounts';

/**
 * An atom that holds the current selected account address.
 * This should not be confused with the accounts' atom, which contains data
 * for ALL the accounts stored on the user's device
 */
export const activeAccountAddressAppState = atom<string | undefined>({
  key: 'activeAccountAddress',
  default: getMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDRESS),
  effects: [
    ({ onSet }) => {
      onSet((newAddress) => {
        setMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDRESS, newAddress ?? '');
      });
    },
  ],
});

/**
 * Hook that allows to get the active account address.
 */
export const useActiveAccountAddress = () => useRecoilValue(activeAccountAddressAppState);

/**
 * Hook that allows to set the active account address.
 */
export const useSetActiveAccountAddress = () => useSetRecoilState(activeAccountAddressAppState);

/**
 * Selector that provides the current selected account.
 */
const activeAccountAppState = selector<Account | undefined>({
  key: 'activeAccount',
  get: ({ get }) => {
    const accounts = get(accountsAppState);
    const selectedAccountAddress = get(activeAccountAddressAppState);
    return selectedAccountAddress ? accounts[selectedAccountAddress] : undefined;
  },
});

export const useActiveAccount = () => useRecoilValue(activeAccountAppState);
