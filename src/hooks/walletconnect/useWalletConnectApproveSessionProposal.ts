import { useCallback } from 'react';
import { useActiveAccount } from '@recoil/activeAccount';
import { getAccountSupportedMethods } from 'lib/WalletConnectUtils';
import { useStoreWalletConnectSession } from '@recoil/walletConnectSessions';
import { WalletConnectSessionProposal } from 'types/walletConnect';
import useTrackWalletConnectSessionEstablished from 'hooks/analytics/useTrackWalletConnectSessionEstablished';
import { err, ok } from 'neverthrow';
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
    async (proposal: WalletConnectSessionProposal) => {
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
      const sessionResult = await promiseToResult(
        approveResponse.acknowledged(),
        'Unknown error while approving the session proposal',
      );
      if (sessionResult.isErr()) {
        return err(sessionResult.error);
      }

      const session = sessionResult.value;
      trackSessionEstablished(session);
      storeSession(activeAccount.address, {
        accountAddress: activeAccount.address,
        topic: session.topic,
        creationDate: new Date().toISOString(),
        description: session.peer.metadata.description,
        name: session.peer.metadata.name,
        icon: session.peer.metadata.icons[0],
        url: session.peer.metadata.url,
      });
      return ok(session);
    },
    [activeAccount, getClient, trackSessionEstablished, storeSession],
  );
};

export default useWalletConnectApproveSessionProposal;
