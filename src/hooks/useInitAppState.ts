import {useEffect, useState} from "react";
import useLoadAccounts from "./useLoadAccounts";
import {useInitI18n} from "../i18n/i18n";
import useLoadAllProfiles from "./useLoadAllProfiles";

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
    const loadProfiles = useLoadAllProfiles();


    useEffect(() => {
        (async () => {
            try {
                await initLocalization();
                // Load accounts and profiles from disk.
                await loadAccounts();
                await loadProfiles();

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