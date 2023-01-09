import { ApolloProvider } from '@apollo/client';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import React, { useMemo, useState } from 'react';
import { DesmosProfile } from 'types/desmos';
import buildGraphQlClient from 'services/graphql/client';
import { DesmosClientProvider } from './DesmosClientContext';

export type InitState = {
  initializing: boolean;
  errorMessage?: string;
};

export interface AppState {
  initializing: InitState;
  setInitializing: React.Dispatch<React.SetStateAction<InitState>>;

  accounts: any[];
  setAccounts: React.Dispatch<React.SetStateAction<any[]>>;
  profiles: Record<string, DesmosProfile>;
  setProfiles: React.Dispatch<React.SetStateAction<Record<string, DesmosProfile>>>;
  chainLinks: Record<string, any[]>;
  setChainLinks: React.Dispatch<React.SetStateAction<Record<string, any[]>>>;
  selectedAccount: any | null;
  setSelectedAccount: React.Dispatch<React.SetStateAction<any | null>>;
  selectedAccountBalance: Coin;
  setSelectedAccountBalance: React.Dispatch<React.SetStateAction<Coin>>;
}

// @ts-ignore
const AppContext = React.createContext<AppState>({});

export const AppStateProvider: React.FC = ({ children }) => {
  const [initializing, setInitializing] = useState<InitState>({
    initializing: true,
  });
  const [accounts, setAccounts] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, DesmosProfile>>({});
  const [chainLinks, setChainLinks] = useState<Record<string, any[]>>({});
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
  const [selectedAccountBalance, setSelectedAccountBalance] = useState<Coin>({
    amount: '0',
    denom: '',
  });
  const client = buildGraphQlClient();

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
    }),
    [initializing, accounts, profiles, chainLinks, selectedAccount, selectedAccountBalance],
  );

  return (
    <AppContext.Provider value={contextProviderValue}>
      <ApolloProvider client={client}>
        <DesmosClientProvider>{children}</DesmosClientProvider>
      </ApolloProvider>
    </AppContext.Provider>
  );
};

function useAppContext(): AppState {
  return React.useContext(AppContext);
}

export default useAppContext;
