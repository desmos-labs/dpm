import { useCallback } from 'react';
import useAppContext from 'contexts/GraphQLClientProvider';
import AccountSource from 'sources/AccountSource';

export type LoadedAccounts = {
  accounts: any[];
  selectedAccount: any | null;
};

/**
 * Hook that provides a function to load all the accounts saved into the
 * device storage into the application state.
 */
export default function useLoadAccounts(): () => Promise<LoadedAccounts> {
  const { setAccounts, setSelectedAccount } = useAppContext();

  return useCallback(async () => {
    let selectedAccount: any | null = null;
    const accounts = await AccountSource.getAllAccounts();
    const selectedAccountAddress = await AccountSource.getSelectedAccount();
    setAccounts(accounts);

    if (selectedAccountAddress !== null) {
      selectedAccount = accounts.find((a) => a.address === selectedAccountAddress) ?? null;
      setSelectedAccount(selectedAccount);
    } else {
      setSelectedAccount(null);
    }

    return {
      accounts,
      selectedAccount,
    };
  }, [setAccounts, setSelectedAccount]);
}
