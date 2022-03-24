import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AccountSource from '../sources/AccountSource';
import {
  CallRequestEvent,
  CallRequestType,
  Events,
  ParsedCallRequest,
} from '../types/walletconnect';
import parseCallRequest from '../utilils/jsonRpcParse';
import WalletConnectController from '../walletconnect/WalletConnectController';

type WalletConnectInitState = {
  initializing: boolean;
  initialized?: boolean;
  error?: string;
};

interface WalletConnectState {
  initState: WalletConnectInitState;
  initWalletConnect: () => void;
  controller: WalletConnectController;
  callRequests: ParsedCallRequest[];
  removeCallRequest: (requestId: number) => void;
}

const WalletConnectContext = React.createContext<WalletConnectState>({
  callRequests: [],
  controller: {} as WalletConnectController,
  initState: {} as WalletConnectInitState,
  initWalletConnect(): void {},
  removeCallRequest(): void {},
});

export const WalletContextProvider: React.FC = ({ children }) => {
  const [initState, setInitState] = useState<WalletConnectInitState>({
    initializing: false,
  });
  const controller = useMemo(() => new WalletConnectController(), []);
  const [callRequests, setCallRequests] = useState<ParsedCallRequest[]>([]);

  const initWalletConnect = useCallback(() => {
    (async () => {
      setInitState({
        initializing: true,
      });
      try {
        await controller.init();
        setInitState({
          initializing: false,
          initialized: true,
        });
      } catch (e) {
        setInitState({
          initializing: false,
          error: e.toString(),
        });
        console.error('WalletConnectController init failed', e);
      }
    })();
  }, [controller]);

  const getChainAccount = async (sessionAccount: string) =>
    AccountSource.getAccount(sessionAccount);

  const onCallRequest = useCallback(
    async (event: CallRequestEvent) => {
      if (event.request) {
        const parsed = parseCallRequest(event.request);
        if (parsed === null) {
          const { id, sessionId, method } = event.request;
          controller.rejectRequest(sessionId, id, `Invalid request method ${method}`);
        } else if (parsed.type === CallRequestType.GetAccounts) {
          // Handle the get accounts request in the background
          // to provide to the dApp the account public key and address.
          const sessionToHandle = controller.sessions.find(
            (session) => session.id === event.sessionId
          );
          const response: {
            algo: 'secp256k1' | 'ed25519' | 'sr25519';
            address: string;
            pubkey: string;
          }[] = [];
          if (sessionToHandle !== undefined) {
            /* for (const sessionAccount of session.accounts) {
							const chainAccount = await getChainAccount(sessionAccount);
							if (chainAccount !== null) {
								response.push({
									algo: chainAccount.signAlgorithm,
									address: chainAccount.address,
									pubkey: chainAccount.pubKey,
								});
							}
						} */
            sessionToHandle.accounts.forEach((sessionAccount) => {
              getChainAccount(sessionAccount).then((chainAccount) => {
                if (chainAccount !== null) {
                  response.push({
                    algo: chainAccount.signAlgorithm,
                    address: chainAccount.address,
                    pubkey: chainAccount.pubKey,
                  });
                }
              });
            });
          }
          controller.approveRequest(parsed.sessionId, parsed.requestId, response);
        } else {
          setCallRequests((old) => [...old, parsed]);
        }
      }
    },
    [controller]
  );

  const removeCallRequest = useCallback((requestId: number) => {
    setCallRequests((oldRequest) => oldRequest.filter((r) => r.requestId !== requestId));
  }, []);

  const contextValue = useMemo(
    () => ({
      initState,
      initWalletConnect,
      controller,
      callRequests,
      removeCallRequest,
    }),
    [callRequests, controller, initState, initWalletConnect, removeCallRequest]
  );

  useEffect(() => {
    controller.addListener(Events.OnCallRequest, onCallRequest);
    return () => {
      controller.removeListener(Events.OnCallRequest, onCallRequest);
    };
  }, [controller, onCallRequest]);

  return (
    <WalletConnectContext.Provider value={contextValue}>{children}</WalletConnectContext.Provider>
  );
};

export const useWalletConnectContext = (): WalletConnectState =>
  React.useContext(WalletConnectContext);
