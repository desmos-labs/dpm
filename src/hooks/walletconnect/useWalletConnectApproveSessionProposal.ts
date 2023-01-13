import { useWalletConnectClient } from '@recoil/walletconnect';
import { useCallback } from 'react';
import { useActiveAccount } from '@recoil/activeAccount';
import { getAccountSupportedMethods } from 'lib/WalletConnectUtils';
import { useStoreWalletConnectSession } from '@recoil/walletConnectSessions';
import { WalletConnectSessionProposal } from 'types/walletConnect';

/**
 * Hook that provides a function to accept a session request.
 */
export default function useWalletConnectApproveSessionProposal() {
  const wcClient = useWalletConnectClient();
  const activeAccount = useActiveAccount();
  const storeSession = useStoreWalletConnectSession();

  return useCallback(
    async (proposal: WalletConnectSessionProposal) => {
      if (wcClient === undefined) {
        throw new Error('wallet connect client not initialized');
      }

      if (activeAccount === undefined) {
        throw new Error('active account is undefined');
      }

      const { client } = wcClient;
      const desmosNamespace = proposal.proposal.requiredNamespaces.desmos;

      const methods = getAccountSupportedMethods(activeAccount);
      const accounts = desmosNamespace.chains.map((chain) => `${chain}:${activeAccount!.address}`);

      const approveResponse = await client.approve({
        id: proposal.id,
        namespaces: {
          desmos: {
            methods,
            accounts,
            events: [],
          },
        },
      });
      console.log('approve topic', approveResponse.topic);

      console.log('wait for acknowledge..,');
      const session = await approveResponse.acknowledged();

      console.log('session acknowledged', session, session.peer.metadata);
      storeSession(activeAccount.address, {
        accountAddress: activeAccount.address,
        topic: session.topic,
        creationDate: new Date().toISOString(),
        description: session.peer.metadata.description,
        name: session.peer.metadata.name,
        icon: session.peer.metadata.icons[0],
        url: session.peer.metadata.url,
      });
    },
    [activeAccount, storeSession, wcClient],
  );
}
