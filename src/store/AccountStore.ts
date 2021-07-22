import {atom} from 'recoil'
import {StoreKeysEnum} from './StoreKeysEnum';
import ChainAccount from "../types/chainAccount";


const chainAccounts = atom<ChainAccount[]>({
    key: StoreKeysEnum.chainAccounts,
    default: [{
        name: 'Test',
        chainId: 'morpheus-apollo-2',
        address: 'desmos1dqvvk4aqk6uhsz44jzt28ttmr6hs39mxesvvws',
        dp: "m/44'/852'/0'/0/0"
    }]
})

export default {
    chainAccounts
}