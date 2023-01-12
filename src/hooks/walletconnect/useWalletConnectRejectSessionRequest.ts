import { useWalletConnectClient } from '@recoil/walletconnect';
import { useCallback } from 'react';
import { WalletConnectSessionProposal } from 'types/walletConnect';
import { getSdkError } from '@walletconnect/utils';

/**
 * Hook that provides a function to accept a session request.
 */
export default function useWalletConnectRejectSessionRequest() {
  const wcClient = useWalletConnectClient();

  return useCallback(
    async (proposal: WalletConnectSessionProposal) => {
      if (wcClient === undefined) {
        throw new Error('wallet connect client not initialized');
      }

      const { client } = wcClient;
      await client.reject({
        id: proposal.id,
        reason: getSdkError('USER_REJECTED'),
      });
    },
    [wcClient],
  );
}
