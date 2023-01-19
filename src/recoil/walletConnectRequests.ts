import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { WalletConnectRequest } from 'types/walletConnect';
import { useCallback, useMemo } from 'react';

/**
 * Atom that holds the requests received from WalletConnect that need to be handled.
 * The requests are stored by their session topic.
 */
const walletConnectSessionRequestsAppState = atom<Record<string, WalletConnectRequest[]>>({
  key: 'walletConnectSessionRequestsAppState',
  default: {},
});

export const useSetWalletConnectSessionRequests = () =>
  useSetRecoilState(walletConnectSessionRequestsAppState);

/**
 * Hook that provides a function to add a wallet connect request to the
 * application state.
 */
export const useStoreWalletConnectSessionRequest = () => {
  const setSessions = useSetWalletConnectSessionRequests();

  return useCallback(
    (request: WalletConnectRequest) => {
      setSessions((currentSessions) => {
        const sessionRequests = currentSessions[request.topic] ?? [];
        return {
          ...currentSessions,
          [request.topic]: [...sessionRequests, request],
        };
      });
    },
    [setSessions],
  );
};

/**
 * Hook that provides a function to remove a wallet connect request from the
 * application state.
 */
export const useRemoveWalletConnectSessionRequest = () => {
  const setSessions = useSetWalletConnectSessionRequests();

  return useCallback(
    (request: WalletConnectRequest) => {
      setSessions((currentRequests) => {
        const sessionRequests = currentRequests[request.topic] ?? [];
        const newSessions = sessionRequests.filter((r) => r.id !== request.id);

        return {
          ...currentRequests,
          [request.topic]: newSessions,
        };
      });
    },
    [setSessions],
  );
};

export const useAllWalletConnectSessionsRequests = () => {
  const sessions = useRecoilValue(walletConnectSessionRequestsAppState);

  return useMemo(() => Object.values(sessions).flatMap((s) => s), [sessions]);
};
