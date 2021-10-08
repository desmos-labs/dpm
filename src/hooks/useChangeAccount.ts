import {useSetRecoilState} from "recoil";
import ChainStore from "../store/ChainStore";
import {ChainAccount} from "../types/chain";
import {useCallback} from "react";
import AccountSource from "../sources/AccountSource";

/**
 * Hook that provides a function to change the current selected account.
 */
export default function useChangeAccount(): (account: ChainAccount) => void {
    const setSelectedAccount = useSetRecoilState(ChainStore.selectedAccount);

    return useCallback((account: ChainAccount) => {
        setSelectedAccount(account);
        AccountSource.setSelectedAccount(account.address);
    }, [setSelectedAccount])
}