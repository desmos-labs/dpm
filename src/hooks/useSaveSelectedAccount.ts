import ChainAccount from "../types/chainAccount";
import AccountSource from "../sources/AccountSource";
import {useSetRecoilState} from "recoil";
import AccountStore from "../store/AccountStore";
import {useCallback} from "react";

/**
 * Hook to save the current selected account into the device storage.
 * Returns a function that save an account into the device storage.
 */
export default function useSaveSelectedAccount() {
    const setSelectedAccount = useSetRecoilState(AccountStore.selectedAccount);

    return useCallback(async (account: ChainAccount, updateAppState?: boolean) => {
        await AccountSource.setSelectedAccount(account.address);
        if (updateAppState === true) {
            setSelectedAccount(account);
        }
    }, [setSelectedAccount]);
}