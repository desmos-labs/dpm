import useAppContext from 'contexts/GraphQLClientProvider';

/**
 * Hooks that provides a stateful variable that contains
 * all the user's accounts.
 */
export default function useAccounts(): any[] {
  const { accounts } = useAppContext();
  return accounts;
}
