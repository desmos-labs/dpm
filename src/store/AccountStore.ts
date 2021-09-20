import {atom} from 'recoil';
import {StoreKeysEnum} from './StoreKeysEnum';
import ChainAccount from '../types/chainAccount';

const chainAccounts = atom<ChainAccount[]>({
    key: StoreKeysEnum.chainAccounts,
    default: [],
});

const selectedAccount = atom<ChainAccount | null>({
    key: StoreKeysEnum.selectedAccount,
    default: null,
});

export default {
    chainAccounts,
    selectedAccount
};
