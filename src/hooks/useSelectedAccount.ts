import useAppContext from 'contexts/AppContext';

/**
 * Hooks that provides the current selected account.
 * Returns the current selected account.
 */
export default function useSelectedAccount(): any {
  const { selectedAccount } = useAppContext();

  if (selectedAccount === null) {
    throw new Error('No selected account');
  }

  return selectedAccount;
}
