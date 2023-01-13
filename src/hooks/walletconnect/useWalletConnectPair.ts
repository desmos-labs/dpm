import { useCallback } from 'react';
import { useWalletConnectClient } from '@recoil/walletconnect';
import { getSdkError } from '@walletconnect/utils';
import { useActiveAccount } from '@recoil/activeAccount';
import { SignClientTypes } from '@walletconnect/types';
import {
  convertWalletConnectSessionProposal,
  getAccountSupportedMethods,
} from 'lib/WalletConnectUtils';
import { WalletConnectSessionProposal } from 'types/walletConnect';

const useValidateSessionRequest = () => {
  const activeAccount = useActiveAccount();

  return useCallback(
    (proposal: SignClientTypes.EventArguments['session_proposal']) => {
      const desmosNamespace = proposal.params.requiredNamespaces.desmos;

      if (desmosNamespace === undefined) {
        return getSdkError('UNSUPPORTED_NAMESPACE_KEY');
      }

      if (activeAccount === undefined) {
        return getSdkError('UNSUPPORTED_METHODS');
      }

      // Check if the current account supports the requested methods
      const walletMethods = getAccountSupportedMethods(activeAccount);
      const methodsNotSupported = desmosNamespace.methods.filter(
        (method) => walletMethods.indexOf(method) === -1,
      );

      if (methodsNotSupported.length > 0) {
        return getSdkError('UNSUPPORTED_METHODS');
      }

      return undefined;
    },
    [activeAccount],
  );
};

/**
 * Hook that provides a function to initiate the pairing procedure with a
 * DApp that use WalletConnect.
 */
export default function useWalletConnectPair() {
  const wcClient = useWalletConnectClient();
  const validateSessionRequest = useValidateSessionRequest();

  return useCallback(
    async (uri: string) => {
      if (wcClient === undefined) {
        throw new Error('wallet connect client not connected');
      }

      const { client } = wcClient;

      // Create the promise that resolves the session proposal.
      const sessionProposalPromise = new Promise<WalletConnectSessionProposal>(
        (resolve, reject) => {
          const timoutTimer = setTimeout(() => {
            reject(new Error('pair request timeout'));
          }, 5000);

          client.on('session_proposal', (proposal) => {
            clearTimeout(timoutTimer);

            console.log('proposal', proposal);

            const validationResul = validateSessionRequest(proposal);

            console.log('validationResult', validationResul);

            if (validationResul !== undefined) {
              client.reject({
                id: proposal.id,
                reason: validationResul,
              });

              reject(new Error(validationResul.message));
            } else {
              resolve(convertWalletConnectSessionProposal(proposal));
            }
          });
        },
      );

      // Start the pairing procedure.
      await client.pair({
        uri,
      });

      return sessionProposalPromise;
    },
    [wcClient, validateSessionRequest],
  );
}