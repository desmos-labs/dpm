import useAppContext from 'contexts/AppContext';
import { ChainAccount } from 'types/chain';

/**
 * Hooks that provides a stateful variable that contains
 * all the user's accounts.
 */
export default function useAccounts(): ChainAccount[] {
  const { accounts } = useAppContext();
  return accounts;
}
