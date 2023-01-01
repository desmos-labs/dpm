import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AccountSource from 'sources/AccountSource';
import {
  CallRequestEvent,
  CallRequestType,
  Events,
  ParsedCallRequest,
} from 'types/walletconnect';
import WalletConnectController from 'walletconnect/WalletConnectController';
import useParseCallRequest from 'hooks/walletconnect/useParseCallRequest';

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
  const parseCallRequest = useParseCallRequest();

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
            (session) => session.id === event.sessionId,
          );
          if (sessionToHandle !== undefined) {
            Promise.all(
              sessionToHandle.accounts.map(getChainAccount).map((chainAccountPromise) =>
                chainAccountPromise.then((chainAccount) => {
                  if (chainAccount !== null) {
                    return {
                      algo: chainAccount.signAlgorithm,
                      address: chainAccount.address,
                      pubkey: chainAccount.pubKey,
                    };
                  }
                  return null;
                }),
              ),
            ).then((accountData) => {
              const filtered = accountData.filter((acc) => acc !== null);
              controller.approveRequest(parsed.sessionId, parsed.requestId, filtered);
            });
          } else {
            controller.approveRequest(parsed.sessionId, parsed.requestId, []);
          }
        } else {
          setCallRequests((old) => [...old, parsed]);
        }
      }
    },
    [controller],
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
    [callRequests, controller, initState, initWalletConnect, removeCallRequest],
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

function useWalletConnectContext(): WalletConnectState {
  return React.useContext(WalletConnectContext);
}

export default useWalletConnectContext;
