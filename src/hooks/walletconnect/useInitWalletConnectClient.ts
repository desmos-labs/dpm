import {
  useSetWalletConnectClient,
  useStoreWalletConnectSessionRequest,
  useWalletConnectClient,
} from '@recoil/walletconnect';
import { useCallback, useEffect } from 'react';
import SignClient from '@walletconnect/sign-client';
import { WALLET_CONNECT_PROJECT_ID } from '@env';
import { SignClientTypes } from '@walletconnect/types';
import * as WalletConnectMMKV from 'lib/MMKVStorage/walletconnect';
import {
  useGetSessionByTopic,
  useRemoveSessionByTopic,
  useWalletConnectSessions,
} from '@recoil/walletConnectSessions';
import { useGetAccounts } from '@recoil/accounts';
import { getSdkError } from '@walletconnect/utils';
import { getAccountSupportedMethods } from 'lib/WalletConnectUtils';
import {
  CosmosRPCMethods,
  decodeAminoSignRpcRequestParams,
  decodeSessionRequest,
  encodeGetAccountsRpcResponse,
} from '@desmoslabs/desmjs-walletconnect-v2';
import { WalletConnectRequest } from 'types/walletConnect';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';

const useOnSessionRequest = (signClient: SignClient | undefined) => {
  const accounts = useGetAccounts();
  const getSessionByTopic = useGetSessionByTopic();
  const storeSessionRequest = useStoreWalletConnectSessionRequest();
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
        return;
      }

      const supportedMethods = getAccountSupportedMethods(account);

      if (args.params.request.method === CosmosRPCMethods.SignAmino) {
        const { signDoc } = decodeAminoSignRpcRequestParams(args.params.request.params).value;
        console.log(signDoc.msgs);
      }

      const decodeResult = decodeSessionRequest(args).map<WalletConnectRequest>((request) => ({
        ...request,
        accountAddress: session.accountAddress,
      }));

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
      if (supportedMethods.indexOf(decodedRequest.method) === -1) {
        console.error(`account ${account.address} don't support`, decodedRequest.method);
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
    [accounts, getSessionByTopic, navigation, signClient, storeSessionRequest],
  );
};

const useOnSessionDelete = () => {
  const removeSessionByTopic = useRemoveSessionByTopic();

  return useCallback(
    (args: SignClientTypes.EventArguments['session_delete']) => {
      console.log('session_delete', args);
      removeSessionByTopic(args.topic);
    },
    [removeSessionByTopic],
  );
};

const useInitWalletConnectClient = () => {
  const setWalletConnectClient = useSetWalletConnectClient();
  const client = useWalletConnectClient();
  const onSessionRequest = useOnSessionRequest(client?.client);
  const onSessionDelete = useOnSessionDelete();
  const deleteSessionByTopic = useRemoveSessionByTopic();
  const savedSessions = useWalletConnectSessions();

  // Effect to subscribe and unsubscribe to session_request
  useEffect(() => {
    client?.client.on('session_request', onSessionRequest);
    return () => {
      client?.client.off('session_request', onSessionRequest);
    };
  }, [onSessionRequest, client]);

  // Effect to subscribe and unsubscribe to session_delete
  useEffect(() => {
    client?.client.on('session_delete', onSessionDelete);
    return () => {
      client?.client.off('session_delete', onSessionDelete);
    };
  }, [onSessionDelete, client]);

  return useCallback(async () => {
    try {
      const signClient = await SignClient.init({
        projectId: WALLET_CONNECT_PROJECT_ID,
        metadata: {
          name: 'Desmos Profile Manager',
          description: 'Desmos Profile Manager',
          url: 'https://dpm.desmos.network',
          icons: [],
        },
        storage: WalletConnectMMKV,
      });

      setWalletConnectClient({ client: signClient });

      // Remove all the inactive sessions from the device storage
      const activeSessions = signClient.session.values;
      Object.values(savedSessions)
        .flatMap((s) => s)
        .filter((s) => !activeSessions.find((as) => as.topic === s.topic))
        .forEach(({ topic }) => deleteSessionByTopic(topic));
    } catch (e) {
      console.warn('Error initializing Wallet connect', e);
    }
  }, [deleteSessionByTopic, savedSessions, setWalletConnectClient]);
};

export default useInitWalletConnectClient;
