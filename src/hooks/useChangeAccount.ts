import { useCallback } from 'react';
import useAppContext from 'contexts/GraphQLClientProvider';
import AccountSource from '../sources/AccountSource';

/**
 * Hook that provides a function to change the current selected account.
 */
export default function useChangeAccount(): (account: any) => void {
  const { setSelectedAccount } = useAppContext();

  return useCallback(
    (account: any) => {
      setSelectedAccount(account);
      AccountSource.setSelectedAccount(account.address).then(() => {});
    },
    [setSelectedAccount],
  );
}
