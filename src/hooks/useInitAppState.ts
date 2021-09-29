import {useEffect, useState} from "react";
import useLoadAccounts from "./useLoadAccounts";
import {useInitI18n} from "../i18n/i18n";

export type InitState = {
    initializing: boolean,
    errorMessage?: string,
}

/**
 * Hook that initialize the application state.
 * Returns a stateful variable that provides the initialization status.
 */
export default function useInitAppState(): InitState {
    const [state, setState] = useState<InitState>({
        initializing: true,
        errorMessage: undefined
    });

    const initLocalization = useInitI18n();
    const loadAccounts = useLoadAccounts();



    useEffect(() => {
        // Load all the account from the disk.
        (async () => {
            try {
                await initLocalization();
                await loadAccounts();

                setState({
                    initializing: false,
                })
            } catch (e) {
                setState({
                    initializing: false,
                    errorMessage: e.toString(),
                })
                console.error(e);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return state;
}