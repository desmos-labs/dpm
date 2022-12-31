import useAppContext from 'contexts/AppContext';
import { ChainAccount } from 'types/chain';

/**
 * Hooks that provides the current selected account.
 * Returns the current selected account.
 */
export default function useSelectedAccount(): ChainAccount {
  const { selectedAccount } = useAppContext();

  if (selectedAccount === null) {
    throw new Error('No selected account');
  }

  return selectedAccount;
}
