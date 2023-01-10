import React from 'react';
import { atom, useRecoilState } from 'recoil';
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
 * Hook that allows to store a new WalletConnect session.
 */
export const useStoreWalletConnectSession = () => {
  const [, setWalletConnectSessions] = useRecoilState(walletConnectSessionsAppState);
  return React.useCallback(
    (user: string, session: WalletConnectSession) => {
      setWalletConnectSessions((currentSessions) => {
        // Merge the new sessions with the existing user sessions
        const currentUserSessions = currentSessions[user] || [];
        const userSessions = currentUserSessions.filter((existing) => existing.id !== session.id);
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
