import { useRemoveWalletConnectSessionRequest } from '@recoil/walletConnectRequests';
import { useCallback } from 'react';
import { WalletConnectRequest } from 'types/walletConnect';
import { ErrorResponse } from '@json-rpc-tools/types';
import { err } from 'neverthrow';
import { promiseToResult } from 'lib/NeverThrowUtils';
import useGetOrConnectWalletConnectClient from './useGetOrConnectWalletConnetClient';

const useWalletConnectRequestReject = () => {
  const removeRequest = useRemoveWalletConnectSessionRequest();
  const getClient = useGetOrConnectWalletConnectClient();

  return useCallback(
    async (request: WalletConnectRequest, errorResponse: ErrorResponse) => {
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
              error: errorResponse,
            },
          })
          .then(() => removeRequest(request)),
        `Unknown error while rejecting request ${request.id}`,
      );
    },
    [getClient, removeRequest],
  );
};

export default useWalletConnectRequestReject;
