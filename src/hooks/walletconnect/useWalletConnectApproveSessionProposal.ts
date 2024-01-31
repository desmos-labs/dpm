import { useCallback } from 'react';
import { useActiveAccount } from '@recoil/activeAccount';
import { getAccountSupportedMethods } from 'lib/WalletConnectUtils';
import { useStoreWalletConnectSession } from '@recoil/walletConnectSessions';
import { WalletConnectSessionProposal } from 'types/walletConnect';
import useTrackWalletConnectSessionEstablished from 'hooks/analytics/useTrackWalletConnectSessionEstablished';
import { Result, err, ok } from 'neverthrow';
import { promiseToResult } from 'lib/NeverThrowUtils';
import useGetOrConnectWalletConnectClient from './useGetOrConnectWalletConnetClient';

/**
 * Hook that provides a function to accept a session request.
 */
const useWalletConnectApproveSessionProposal = () => {
  const getClient = useGetOrConnectWalletConnectClient();
  const activeAccount = useActiveAccount();
  const storeSession = useStoreWalletConnectSession();
  const trackSessionEstablished = useTrackWalletConnectSessionEstablished();

  return useCallback(
    async (proposal: WalletConnectSessionProposal): Promise<Result<void, Error>> => {
      if (activeAccount === undefined) {
        return err(new Error('active account is undefined'));
      }

      const getClientResult = await getClient();
      if (getClientResult.isErr()) {
        return err(getClientResult.error);
      }

      const client = getClientResult.value;
      const desmosNamespace = proposal.proposal.requiredNamespaces.desmos;

      const methods = getAccountSupportedMethods(activeAccount);
      const accounts = desmosNamespace.chains.map((chain) => `${chain}:${activeAccount!.address}`);

      const approveResponseResult = await promiseToResult(
        client.approve({
          id: proposal.id,
          namespaces: {
            desmos: {
              methods,
              accounts,
              events: [],
            },
          },
        }),
        'Unknown error while approving the session proposal',
      );
      if (approveResponseResult.isErr()) {
        return err(approveResponseResult.error);
      }

      const approveResponse = approveResponseResult.value;
      trackSessionEstablished(proposal.name, proposal.proposal.requiredNamespaces);
      storeSession(activeAccount.address, {
        accountAddress: activeAccount.address,
        topic: approveResponse.topic,
        creationDate: new Date().toISOString(),
        description: proposal.description,
        name: proposal.name,
        icon: proposal.iconUri,
      });
      return ok(undefined);
    },
    [activeAccount, getClient, storeSession, trackSessionEstablished],
  );
};

export default useWalletConnectApproveSessionProposal;
