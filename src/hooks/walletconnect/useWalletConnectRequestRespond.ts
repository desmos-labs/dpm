import { useRemoveWalletConnectSessionRequest } from '@recoil/walletConnectRequests';
import { useCallback } from 'react';
import { WalletConnectRequest } from 'types/walletConnect';
import { err } from 'neverthrow';
import { promiseToResult } from 'lib/NeverThrowUtils';
import useGetOrConnectWalletConnectClient from './useGetOrConnectWalletConnetClient';

const useWalletConnectRequestRespond = () => {
  const removeRequest = useRemoveWalletConnectSessionRequest();
  const getClient = useGetOrConnectWalletConnectClient();

  return useCallback(
    async (request: WalletConnectRequest, result: any) => {
      const getClientResult = await getClient();
      if (getClientResult.isErr()) {
        return err(getClientResult.error);
      }

      const client = getClientResult.value;
      return promiseToResult(
        client
          .respond({
            topic: request.topic,
            response: {
              id: request.id,
              jsonrpc: '2.0',
              result,
            },
          })
          .then(() => removeRequest(request)),
        `Unknown error while responding to request ${request.id}`,
      );
    },
    [getClient, removeRequest],
  );
};

export default useWalletConnectRequestRespond;
