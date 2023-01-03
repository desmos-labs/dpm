import useAppContext from 'contexts/AppContext';

/**
 * Hooks that provides a stateful variable that contains
 * all the user's accounts.
 */
export default function useAccounts(): any[] {
  const { accounts } = useAppContext();
  return accounts;
}
