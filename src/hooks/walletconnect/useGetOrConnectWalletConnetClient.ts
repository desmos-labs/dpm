import { useGetWalletConnectClientState } from '@recoil/walletconnect';
import { ok } from 'neverthrow';
import React from 'react';
import { WalletConnectClientStatus } from 'types/walletConnect';
import { useConnectWalletConnect } from './useConnectWalletConnect';

/**
 * Hook that provides a function that gets the local
 * wallet connect client and if is not connected will initialize initialize it
 * and return the new initialized instance.
 */
const useGetOrConnectWalletConnectClient = () => {
  const getState = useGetWalletConnectClientState();
  const connectClient = useConnectWalletConnect();

  return React.useCallback(async () => {
    const state = await getState();
    if (state.status === WalletConnectClientStatus.Connected) {
      return ok(state.client);
    }
    return connectClient();
  }, [connectClient, getState]);
};

export default useGetOrConnectWalletConnectClient;
