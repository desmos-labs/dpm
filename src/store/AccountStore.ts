import {atom} from 'recoil';
import {StoreKeysEnum} from './StoreKeysEnum';
import ChainAccount from '../types/chainAccount';

const chainAccounts = atom<ChainAccount[]>({
    key: StoreKeysEnum.chainAccounts,
    default: [],
});

export default {
    chainAccounts,
};
