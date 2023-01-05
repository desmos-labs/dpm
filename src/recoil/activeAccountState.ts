import { atom } from 'recoil';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';

/**
 * An atom that holds the current selected account address.
 */
const activeAccountAddress = atom<string | undefined>({
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

export default activeAccountAddress;
