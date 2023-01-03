import { useCallback } from 'react';

/**
 * Hook to create a wallet that is stored into the device storage.
 * Returns a stateful variable that provides the wallet creation status and a function to create
 * a wallet from a recovery passphrase(mnemonic).
 */
export default function useCreateLocalWallet() {
  return useCallback((_userMnemonic: string, _options?: any): Promise<any> => Promise.reject(), []);
}
