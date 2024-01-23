import { useCallback } from 'react';
import { getSdkError } from '@walletconnect/utils';
import { useActiveAccount } from '@recoil/activeAccount';
import { SignClientTypes } from '@walletconnect/types';
import {
  convertWalletConnectSessionProposal,
  getAccountSupportedMethods,
} from 'lib/WalletConnectUtils';
import { WalletConnectSessionProposal } from 'types/walletConnect';
import { Result, err, ok } from 'neverthrow';
import useGetOrConnectWalletConnectClient from './useGetOrConnectWalletConnetClient';

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
const useWalletConnectPair = () => {
  const getClient = useGetOrConnectWalletConnectClient();
  const validateSessionRequest = useValidateSessionRequest();

  return useCallback(
    async (uri: string) => {
      const getClientResult = await getClient();
      if (getClientResult.isErr()) {
        return err<WalletConnectSessionProposal, Error>(getClientResult.error);
      }
      const client = getClientResult.value;

      // Create the promise that resolves the session proposal.
      const sessionProposalPromise = new Promise<Result<WalletConnectSessionProposal, Error>>(
        (resolve) => {
          const timeoutTimer = setTimeout(() => {
            resolve(err(new Error('pair request timeout')));
          }, 5000);

          client.on('session_proposal', (proposal) => {
            clearTimeout(timeoutTimer);
            const validationResult = validateSessionRequest(proposal);
            if (validationResult !== undefined) {
              client
                .reject({
                  id: proposal.id,
                  reason: validationResult,
                })
                .then(() => resolve(err(new Error(validationResult.message))))
                .catch((rejection) => resolve(err(rejection)));
            } else {
              resolve(ok(convertWalletConnectSessionProposal(proposal)));
            }
          });
        },
      );

      // Start the pairing procedure.
      // Don't await since on failure this promise don't resolve.
      client.pair({
        uri,
      });

      return sessionProposalPromise;
    },
    [getClient, validateSessionRequest],
  );
};

export default useWalletConnectPair;
