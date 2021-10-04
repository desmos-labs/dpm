import {ChainAccount} from "../types/chain";
import {useRecoilValue} from "recoil";
import ChainStore from "../store/ChainStore";

/**
 * Hooks that provides the current selected account.
 * Returns the current selected account.
 */
export default function useSelectedAccount(): ChainAccount | null {
    return useRecoilValue(ChainStore.selectedAccount);
}