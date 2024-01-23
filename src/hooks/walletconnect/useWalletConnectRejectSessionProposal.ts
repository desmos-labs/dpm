import { useCallback } from 'react';
import { WalletConnectSessionProposal } from 'types/walletConnect';
import { getSdkError } from '@walletconnect/utils';
import { err } from 'neverthrow';
import { promiseToResult } from 'lib/NeverThrowUtils';
import useGetOrConnectWalletConnectClient from './useGetOrConnectWalletConnetClient';

/**
 * Hook that provides a function to accept a session request.
 */
const useWalletConnectRejectSessionProposal = () => {
  const getClient = useGetOrConnectWalletConnectClient();

  return useCallback(
    async (proposal: WalletConnectSessionProposal) => {
      const getClientResult = await getClient();
      if (getClientResult.isErr()) {
        return err(getClientResult.error);
      }
      const client = getClientResult.value;

      return promiseToResult(
        client.reject({
          id: proposal.id,
          reason: getSdkError('USER_REJECTED'),
        }),
        `Unknown error while rejecting proposal ${proposal.id}`,
      );
    },
    [getClient],
  );
};

export default useWalletConnectRejectSessionProposal;
