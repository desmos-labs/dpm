import { useSetWalletConnectClient, useWalletConnectClient } from '@recoil/walletconnect';
import { useCallback, useEffect, useMemo } from 'react';
import SignClient from '@walletconnect/sign-client';
import { WALLET_CONNECT_PROJECT_ID } from '@env';
import { SignClientTypes } from '@walletconnect/types';
import * as WalletConnectMMKV from 'lib/MMKVStorage/walletconnect';
import { useRemoveSessionByTopic, useWalletConnectSessions } from '@recoil/walletConnectSessions';
import { useGetAccounts } from '@recoil/accounts';
import { getSdkError } from '@walletconnect/utils';
import { getAccountSupportedMethods } from 'lib/WalletConnectUtils';
import {
  CosmosRPCMethods,
  encodeGetAccountsRpcResponse,
} from '@desmoslabs/desmjs-walletconnect-v2';

const useOnSessionRequest = (signClient: SignClient | undefined) => {
  const accounts = useGetAccounts();
  const sessions = useWalletConnectSessions();
  const flatSessions = useMemo(() => Object.values(sessions).flatMap((v) => v), [sessions]);

  return useCallback(
    (args: SignClientTypes.EventArguments['session_request']) => {
      if (signClient === undefined) {
        return;
      }

      console.log('session_request', args);

      // Find the session from the app state sessions.
      const session = flatSessions.find((s) => s.topic === args.topic);

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
      const { method, params } = args.params.request;
      if (supportedMethods.indexOf(method) === -1) {
        console.error(`account ${account.address} don't support`, method);
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

      switch (method) {
        case CosmosRPCMethods.GetAccounts:
          signClient.respond({
            topic: args.topic,
            response: {
              id: args.id,
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
          // TODO: handle SignAmino request
          signClient.respond({
            topic: args.topic,
            response: {
              id: args.id,
              jsonrpc: '2.0',
              error: getSdkError('UNSUPPORTED_METHODS'),
            },
          });
          break;
        case CosmosRPCMethods.SignDirect:
          // TODO: handle SignDirect request
          signClient.respond({
            topic: args.topic,
            response: {
              id: args.id,
              jsonrpc: '2.0',
              error: getSdkError('UNSUPPORTED_METHODS'),
            },
          });
          break;
        default:
          console.error('invalid wallet connect method', method);
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
    [accounts, flatSessions, signClient],
  );
};

const useOnSessionDelete = (signClient: SignClient | undefined) => {
  const removeSessionByTopic = useRemoveSessionByTopic();

  return useCallback(
    (args: SignClientTypes.EventArguments['session_delete']) => {
      console.log('session_delete', args);
      removeSessionByTopic(args.topic);
    },
    [removeSessionByTopic],
  );
};

const useOnSessionEvent = (signClient: SignClient | undefined) =>
  useCallback((args: SignClientTypes.EventArguments['session_event']) => {
    console.log('session_event', args);
  }, []);

const useInitWalletConnectClient = () => {
  const setWalletConnectClient = useSetWalletConnectClient();
  const client = useWalletConnectClient();
  const onSessionRequest = useOnSessionRequest(client?.client);
  const onSessionDelete = useOnSessionDelete(client?.client);
  const onSessionEvent = useOnSessionEvent(client?.client);
  const deleteSessionByTopic = useRemoveSessionByTopic();
  const savedSessions = useWalletConnectSessions();

  // Effect to subscribe and unsubscribe to session_request
  useEffect(() => {
    client?.client.on('session_request', onSessionRequest);
    return () => {
      client?.client.off('session_request', onSessionRequest);
    };
  }, [onSessionRequest, client]);

  // Effect to subscribe and unsubscribe to session_event
  useEffect(() => {
    client?.client.on('session_event', onSessionEvent);
    return () => {
      client?.client.off('session_event', onSessionEvent);
    };
  }, [onSessionEvent, client]);

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
        // logger: __DEV__ ? 'debug' : undefined,
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
