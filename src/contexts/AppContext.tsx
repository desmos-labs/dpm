import { ApolloProvider } from '@apollo/client';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import React, { useMemo, useState } from 'react';
import useApolloClient from 'graphql/hooks/useApolloClient';
import { ChainAccount } from 'types/chainLinks';
import { DesmosProfile } from 'types/desmosTypes';
import { ChainLink } from 'types/link';
import { AppSettings, DefaultAppSettings } from 'types/settings';
import { DesmosClientProvider } from './DesmosClientContext';

export type InitState = {
  initializing: boolean;
  errorMessage?: string;
};

export interface AppState {
  initializing: InitState;
  setInitializing: React.Dispatch<React.SetStateAction<InitState>>;

  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  accounts: ChainAccount[];
  setAccounts: React.Dispatch<React.SetStateAction<ChainAccount[]>>;
  profiles: Record<string, DesmosProfile>;
  setProfiles: React.Dispatch<React.SetStateAction<Record<string, DesmosProfile>>>;
  chainLinks: Record<string, ChainLink[]>;
  setChainLinks: React.Dispatch<React.SetStateAction<Record<string, ChainLink[]>>>;
  selectedAccount: ChainAccount | null;
  setSelectedAccount: React.Dispatch<React.SetStateAction<ChainAccount | null>>;
  selectedAccountBalance: Coin;
  setSelectedAccountBalance: React.Dispatch<React.SetStateAction<Coin>>;
}

// @ts-ignore
const AppContext = React.createContext<AppState>({});

export const AppStateProvider: React.FC = ({ children }) => {
  const [initializing, setInitializing] = useState<InitState>({
    initializing: true,
  });
  const [accounts, setAccounts] = useState<ChainAccount[]>([]);
  const [profiles, setProfiles] = useState<Record<string, DesmosProfile>>({});
  const [chainLinks, setChainLinks] = useState<Record<string, ChainLink[]>>({});
  const [selectedAccount, setSelectedAccount] = useState<ChainAccount | null>(null);
  const [selectedAccountBalance, setSelectedAccountBalance] = useState<Coin>({
    amount: '---',
    denom: '',
  });
  const [settings, setSettings] = useState(DefaultAppSettings);
  const client = useApolloClient(settings.chainType);

  const contextProviderValue = useMemo(
    () => ({
      initializing,
      setInitializing,
      accounts,
      setAccounts,
      profiles,
      setProfiles,
      chainLinks,
      setChainLinks,
      selectedAccount,
      setSelectedAccount,
      selectedAccountBalance,
      setSelectedAccountBalance,
      settings,
      setSettings,
    }),
    [
      initializing,
      accounts,
      profiles,
      chainLinks,
      selectedAccount,
      selectedAccountBalance,
      settings,
    ],
  );

  return (
    <AppContext.Provider value={contextProviderValue}>
      <ApolloProvider client={client}>
        <DesmosClientProvider chainId={settings.chainType}>{children}</DesmosClientProvider>
      </ApolloProvider>
    </AppContext.Provider>
  );
};

function useAppContext(): AppState {
  return React.useContext(AppContext);
}

export default useAppContext;
