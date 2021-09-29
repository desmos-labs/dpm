import {ChainAccount} from "../types/chain";
import {useRecoilValue} from "recoil";
import AccountStore from "../store/AccountStore";

/**
 * Hooks that provides the current selected account.
 * Returns the current selected account.
 */
export default function useSelectedAccount(): ChainAccount | null {
    return useRecoilValue(AccountStore.selectedAccount);
}