import AccountSource from "../sources/AccountSource";
import {useCallback} from "react";
import {ChainAccount} from "../types/chain";
import {useSetRecoilState} from "recoil";
import ChainStore from "../store/ChainStore";

export type LoadedAccounts = {
    accounts: ChainAccount []
    selectedAccount: ChainAccount | null,
}

/**
 * Hook that provides a function to load all the accounts saved into the
 * device storage into the application state.
 */
export default function useLoadAccounts(): () => Promise<LoadedAccounts> {

    const setAccounts = useSetRecoilState(ChainStore.chainAccounts);
    const setSelectedAccount = useSetRecoilState(ChainStore.selectedAccount);

    return useCallback(async () => {
        let selectedAccount: ChainAccount | null = null
        const accounts = await AccountSource.getAllAccounts();
        const selectedAccountAddress = await AccountSource.getSelectedAccount();
        setAccounts(accounts);

        if (selectedAccountAddress !== null) {
            selectedAccount = accounts.find(a => a.address === selectedAccountAddress) ?? null;
            setSelectedAccount(selectedAccount);
        } else {
            setSelectedAccount(null);
        }

        return {
            accounts,
            selectedAccount,
        }
    }, [setAccounts, setSelectedAccount]);
}