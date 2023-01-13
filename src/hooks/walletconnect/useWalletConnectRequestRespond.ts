import {
  useRemoveWalletConnectSessionRequest,
  useWalletConnectClient,
} from '@recoil/walletconnect';
import { useCallback } from 'react';
import { WalletConnectRequest } from 'types/walletConnect';

const useWalletConnectRequestRespond = () => {
  const removeRequest = useRemoveWalletConnectSessionRequest();
  const wcClient = useWalletConnectClient();

  return useCallback(
    async (request: WalletConnectRequest, result: any) => {
      if (wcClient === undefined) {
        throw new Error('wallet connect client not connected');
      }

      const { client } = wcClient;
      await client.respond({
        topic: request.topic,
        response: {
          id: request.id,
          jsonrpc: '2.0',
          result,
        },
      });

      removeRequest(request);
    },
    [wcClient, removeRequest],
  );
};

export default useWalletConnectRequestRespond;
