import SignClient from '@walletconnect/sign-client';
import { useGetAccounts } from '@recoil/accounts';
import { useGetSessionByTopic, useRemoveSessionByTopic } from '@recoil/walletConnectSessions';
import { useStoreWalletConnectSessionRequest } from '@recoil/walletConnectRequests';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { useCallback } from 'react';
import { SignClientTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';
import { decodeSessionRequest, getAccountSupportedMethods } from 'lib/WalletConnectUtils';
import {
  CosmosRPCMethods,
  encodeGetAccountsRpcResponse,
} from '@desmoslabs/desmjs-walletconnect-v2';
import ROUTES from 'navigation/routes';

const useOnSessionRequest = (signClient: SignClient | undefined) => {
  const accounts = useGetAccounts();
  const getSessionByTopic = useGetSessionByTopic();
  const storeSessionRequest = useStoreWalletConnectSessionRequest();
  const removeSessionByTopic = useRemoveSessionByTopic();
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  return useCallback(
    (args: SignClientTypes.EventArguments['session_request']) => {
      if (signClient === undefined) {
        return;
      }

      // Find the session from the app state sessions.
      const session = getSessionByTopic(args.topic);

      if (session === undefined) {
        console.error("can't find session with topic", args.topic);
        signClient.respond({
          topic: args.topic,
          response: {
            id: args.id,
            jsonrpc: '2.0',
            error: getSdkError('USER_DISCONNECTED'),
          },
        });
        return;
      }

      const account = accounts[session.accountAddress];
      if (account === undefined) {
        console.error("can't find account with address", session.accountAddress);
        signClient.respond({
          topic: args.topic,
          response: {
            id: args.id,
            jsonrpc: '2.0',
            error: getSdkError('USER_DISCONNECTED'),
          },
        });
        signClient.disconnect({
          topic: session.topic,
          reason: getSdkError('USER_DISCONNECTED'),
        });
        removeSessionByTopic(session.topic);
        return;
      }

      const supportedMethods = getAccountSupportedMethods(account);
      if (supportedMethods.indexOf(args.params.request.method) === -1) {
        console.error(`account ${account.address} don't support`, args.params.request.method);
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
        console.error(`decode request error ${decodeResult.error}`);
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
          storeSessionRequest(decodedRequest);
          navigation.navigate(ROUTES.WALLET_CONNECT_REQUEST);
          break;
        default:
          // @ts-ignore
          console.error('unsupported method', decodedRequest.method);
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
    [
      accounts,
      getSessionByTopic,
      navigation,
      removeSessionByTopic,
      signClient,
      storeSessionRequest,
    ],
  );
};

export default useOnSessionRequest;
