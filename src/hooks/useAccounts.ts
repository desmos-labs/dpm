import { ChainAccount } from '../types/chain';
import { useAppContext } from '../contexts/AppContext';

/**
 * Hooks that provides a stateful variable that contains
 * all the user's accounts.
 */
export default function useAccounts(): ChainAccount[] {
  const { accounts } = useAppContext();
  return accounts;
}
