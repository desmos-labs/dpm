import { useWalletConnectClient } from '@recoil/walletconnect';
import { useRemoveWalletConnectSessionRequest } from '@recoil/walletConnectRequests';
import { useCallback } from 'react';
import { WalletConnectRequest } from 'types/walletConnect';
import { ErrorResponse } from '@json-rpc-tools/types';

const useWalletConnectRequestReject = () => {
  const removeRequest = useRemoveWalletConnectSessionRequest();
  const wcClient = useWalletConnectClient();

  return useCallback(
    async (request: WalletConnectRequest, errorResponse: ErrorResponse) => {
      if (wcClient === undefined) {
        throw new Error('wallet connect client not connected');
      }

      const { client } = wcClient;
      await client.respond({
        topic: request.topic,
        response: {
          id: request.id,
          jsonrpc: '2.0',
          error: errorResponse,
        },
      });

      removeRequest(request);
    },
    [wcClient, removeRequest],
  );
};

export default useWalletConnectRequestReject;
