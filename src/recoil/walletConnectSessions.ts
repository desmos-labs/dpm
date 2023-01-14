import React, { useCallback, useMemo } from 'react';
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { WalletConnectSession } from 'types/walletConnect';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';

/**
 * Atom that contains all the WalletConnect sessions ever created.
 */
export const walletConnectSessionsAppState = atom<Record<string, WalletConnectSession[]>>({
  key: 'walletConnectSessions',
  default: getMMKV(MMKVKEYS.WALLET_CONNECT_SESSIONS) || {},
  effects: [
    ({ onSet }) => {
      onSet((newSessions) => {
        setMMKV(MMKVKEYS.WALLET_CONNECT_SESSIONS, newSessions);
      });
    },
  ],
});

/**
 * Hook that provides the current wallet connect sessions.
 */
export const useWalletConnectSessions = () => useRecoilValue(walletConnectSessionsAppState);

/**
 * Hook that allows to store a new WalletConnect session.
 */
export const useStoreWalletConnectSession = () => {
  const [, setWalletConnectSessions] = useRecoilState(walletConnectSessionsAppState);
  return React.useCallback(
    (user: string, session: WalletConnectSession) => {
      setWalletConnectSessions((currentSessions) => {
        // Merge the new sessions with the existing user sessions
        const currentUserSessions = currentSessions[user] || [];
        const userSessions = currentUserSessions.filter(
          (existing) => existing.topic !== session.topic,
        );
        userSessions.push(session);

        // Merge the updated user sessions into the overall sessions state
        const updatedSessions: Record<string, WalletConnectSession[]> = {
          ...currentSessions,
        };
        updatedSessions[user] = userSessions;
        return updatedSessions;
      });
    },
    [setWalletConnectSessions],
  );
};

/**
 * Hook that provides a function to delete a session by its
 * topic.
 */
export const useRemoveSessionByTopic = () => {
  const setWalletConnectSessions = useSetRecoilState(walletConnectSessionsAppState);

  return useCallback(
    (topic: string) => {
      setWalletConnectSessions((currentSessions) => {
        const session = Object.values(currentSessions)
          .flatMap((v) => v)
          .find((s) => s.topic === topic);

        if (session === undefined) {
          return currentSessions;
        }

        const newSessions = currentSessions[session.accountAddress].filter(
          (s) => s.topic !== topic,
        );
        return {
          ...currentSessions,
          [session.accountAddress]: newSessions,
        };
      });
    },
    [setWalletConnectSessions],
  );
};

/**
 * Hook that provide a function to get a WalletConnectSession by its topic.
 */
export const useGetSessionByTopic = () => {
  const sessions = useWalletConnectSessions();
  const flattenSessions = useMemo(() => Object.values(sessions).flatMap((v) => v), [sessions]);

  return useCallback(
    (topic: string) => flattenSessions.find((s) => s.topic === topic),
    [flattenSessions],
  );
};

/**
 * Hook that provides a function to remove all the wallet connect sessions
 * of a user from the app state.
 */
export const useWalletConnectClearAccountSessions = () => {
  const setSessions = useSetRecoilState(walletConnectSessionsAppState);

  return useCallback(
    (accountAddress: string) => {
      setSessions((currentSessions) => {
        const newSessions = { ...currentSessions };
        delete newSessions[accountAddress];
        return newSessions;
      });
    },
    [setSessions],
  );
};
