import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ChainAccount } from '../types/chain';

/**
 * Hooks that provides a function to update the global
 * variable that contains the user's accounts.
 */
export default function useSetAccounts(): React.Dispatch<React.SetStateAction<ChainAccount[]>> {
  const { setAccounts } = useAppContext();
  return setAccounts;
}
