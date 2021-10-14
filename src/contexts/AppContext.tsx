import {CachedDesmosProfile, ChainAccount} from "../types/chain";
import React, {useState} from "react";

export type InitState = {
    initializing: boolean,
    errorMessage?: string,
}

export interface AppState {
    initializing: InitState,
    setInitializing: React.Dispatch<React.SetStateAction<InitState>>,

    accounts: ChainAccount[],
    setAccounts: React.Dispatch<React.SetStateAction<ChainAccount[]>>,
    profiles: Record<string, CachedDesmosProfile>,
    setProfiles: React.Dispatch<React.SetStateAction<Record<string, CachedDesmosProfile>>>,
    selectedAccount: ChainAccount | null,
    setSelectedAccount: React.Dispatch<React.SetStateAction<ChainAccount | null>>,
}


// @ts-ignore
const AppContext = React.createContext<AppState>({});

export const AppStateProvider: React.FC = ({children}) => {

    const [initializing, setInitializing] = useState<InitState>({
        initializing: true,
    });
    const [accounts, setAccounts] = useState<ChainAccount[]>([]);
    const [profiles, setProfiles] = useState<Record<string, CachedDesmosProfile>>({});
    const [selectedAccount, setSelectedAccount] = useState<ChainAccount | null>(null);

    return <AppContext.Provider value={{
        initializing,
        setInitializing,
        accounts,
        setAccounts,
        profiles,
        setProfiles,
        selectedAccount,
        setSelectedAccount
    }}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = (): AppState => React.useContext(AppContext);