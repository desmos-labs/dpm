import { useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import AccountSource from '../sources/AccountSource';
import { ChainAccount } from '../types/chain';

/**
 * Hook that provides a function to change the current selected account.
 */
export default function useChangeAccount(): (account: ChainAccount) => void {
  const { setSelectedAccount } = useAppContext();

  return useCallback(
    (account: ChainAccount) => {
      setSelectedAccount(account);
      AccountSource.setSelectedAccount(account.address).then(() => {});
    },
    [setSelectedAccount]
  );
}
