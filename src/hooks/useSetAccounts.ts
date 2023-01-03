import React from 'react';
import useAppContext from 'contexts/AppContext';

/**
 * Hooks that provides a function to update the global
 * variable that contains the user's accounts.
 */
export default function useSetAccounts(): React.Dispatch<React.SetStateAction<any[]>> {
  const { setAccounts } = useAppContext();
  return setAccounts;
}
