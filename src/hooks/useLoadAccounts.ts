import AccountSource from "../sources/AccountSource";
import {useRecoilState} from "recoil";
import AccountStore from "../store/AccountStore";
import {useEffect, useState} from "react";
import Deferred from "../types/defered";

/**
 * Hook to load all the user's account into the application state.
 * Returns a stateful variable that provides the load status.
 */
export default function (): Deferred<null> {

    const [loadStatus, setLoadStatus] = useState<Deferred<null>>(Deferred.pending());
    const [, setAccounts] = useRecoilState(AccountStore.chainAccounts);
    const [, setSelectedAccount] = useRecoilState(AccountStore.selectedAccount);

    const loadAccounts = async () => {
        try {
            const accounts = await AccountSource.getAllAccounts();
            const selectedAccountAddress = await AccountSource.getSelectedAccount();
            if (selectedAccountAddress !== null) {
                const selectedAccount = accounts.find(a => a.address === selectedAccountAddress);
                if (selectedAccount !== undefined) {
                    setSelectedAccount(selectedAccount);
                }
            }
            setAccounts(accounts);
            setLoadStatus(Deferred.completed(null))
        } catch (ex) {
            setLoadStatus(Deferred.failed(ex.toString()))
        }
    }

    useEffect(() => {
        loadAccounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return loadStatus;
}