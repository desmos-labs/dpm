import {atom} from 'recoil';
import {StoreKeysEnum} from './StoreKeysEnum';
import {CachedDesmosProfile, ChainAccount} from '../types/chain';

/**
 * Atom that contains all the accounts added
 * from the user.
 */
const chainAccounts = atom<ChainAccount[]>({
    key: StoreKeysEnum.chainAccounts,
    default: [],
});

/**
 * Atom that contains all the profiles associated to the
 * accounts presents inside the application.
 */
const profiles = atom<Record<string, CachedDesmosProfile>>({
    key: StoreKeysEnum.profiles,
    default: {}
});

/**
 * Atom that contains the current selected account.
 */
const selectedAccount = atom<ChainAccount | null>({
    key: StoreKeysEnum.selectedAccount,
    default: null,
});

export default {
    chainAccounts,
    profiles,
    selectedAccount
};
