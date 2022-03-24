import { useCallback } from 'react';
import LocalWalletsSource from '../sources/LocalWalletsSource';
import LocalWallet from '../wallet/LocalWallet';

/**
 * Hook to save a wallet into the device storage.
 * Returns a function to save the wallet into the device storage.
 */
export default function useSaveWallet() {
  return useCallback(
    async (wallet: LocalWallet, password: string, biometricProtected?: boolean) => {
      await LocalWalletsSource.putWallet(wallet, password, biometricProtected);
      return wallet;
    },
    []
  );
}
