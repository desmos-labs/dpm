import { atom } from 'recoil';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { Account } from 'types/account';

/**
 * An atom that holds all the accounts stored in the application.
 */
const accounts = atom<Record<string, Account>>({
  key: 'accounts',
  default: getMMKV(MMKVKEYS.ACCOUNTS) || {},
  effects: [
    ({onSet}) => {
      onSet(newAccounts => {
        setMMKV(MMKVKEYS.ACCOUNTS, newAccounts);
      });
    },
  ],
});


export default accounts;
