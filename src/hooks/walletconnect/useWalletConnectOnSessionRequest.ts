import SignClient from '@walletconnect/sign-client';
import { useStoredAccounts } from '@recoil/accounts';
import { useGetSessionByTopic } from '@recoil/walletConnectSessions';
import { useStoreWalletConnectSessionRequest } from '@recoil/walletConnectRequests';
import { useCallback } from 'react';
import { SignClientTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';
import { decodeSessionRequest, getAccountSupportedMethods } from 'lib/WalletConnectUtils';
import {
  CosmosRPCMethods,
  encodeGetAccountsRpcResponse,
} from '@desmoslabs/desmjs-walletconnect-v2';

const useWalletConnectOnSessionRequest = () => {
  const accounts = useStoredAccounts();
  const getSessionByTopic = useGetSessionByTopic();
  const storeSessionRequest = useStoreWalletConnectSessionRequest();

  return useCallback(
    async (signClient: SignClient, args: SignClientTypes.EventArguments['session_request']) => {
      // Find the session from the app state sessions.
      const session = getSessionByTopic(args.topic);
      if (session === undefined) {
        // @ts-ignore
        signClient.pendingRequest.delete(args.topic, getSdkError('USER_DISCONNECTED'));
        return;
      }

      const account = accounts[session.accountAddress];
      const supportedMethods = getAccountSupportedMethods(account);
      if (supportedMethods.indexOf(args.params.request.method) === -1) {
        signClient.respond({
          topic: args.topic,
          response: {
            id: args.id,
            jsonrpc: '2.0',
            error: getSdkError('INVALID_METHOD'),
          },
        });
        return;
      }

      const decodeResult = decodeSessionRequest(args, session.accountAddress);
      if (decodeResult.isError()) {
        signClient.respond({
          topic: args.topic,
          response: {
            id: args.id,
            jsonrpc: '2.0',
            error: {
              message: decodeResult.error,
              code: 1,
            },
          },
        });
        return;
      }

      const decodedRequest = decodeResult.value;
      switch (decodedRequest.method) {
        case CosmosRPCMethods.GetAccounts:
          signClient.respond({
            topic: decodedRequest.topic,
            response: {
              id: decodedRequest.id,
              jsonrpc: '2.0',
              result: encodeGetAccountsRpcResponse([
                {
                  address: account.address,
                  algo: account.algo,
                  pubkey: account.pubKey,
                },
              ]),
            },
          });
          break;
        case CosmosRPCMethods.SignAmino:
        case CosmosRPCMethods.SignDirect:
          // In this case we just store the request since
          // the logic to display the request to the user is inside the
          // useHandleReceivedActions hook.
          storeSessionRequest(decodedRequest);
          break;
        default:
          signClient.respond({
            topic: args.topic,
            response: {
              id: args.id,
              jsonrpc: '2.0',
              error: getSdkError('INVALID_METHOD'),
            },
          });
          break;
      }
    },
    [accounts, getSessionByTopic, storeSessionRequest],
  );
};

export default useWalletConnectOnSessionRequest;
