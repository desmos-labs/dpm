import { useCallback } from 'react';
import { ChainAccount } from 'types/chainLinks';
import AccountSource from 'sources/AccountSource';

/**
 * Hook to save the current selected account into the device storage.
 * Returns a function that save an account into the device storage.
 */
export default function useSaveSelectedAccount() {
  return useCallback(async (account: ChainAccount) => {
    await AccountSource.setSelectedAccount(account.address);
  }, []);
}
