import React from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { WalletConnectSession } from 'types/walletConnect';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';

/**
 * Atom that contains all the WalletConnect sessions.
 */
const walletConnectSessionsAppState = atom<WalletConnectSession[]>({
  key: 'walletConnectSessions',
  default: getMMKV(MMKVKEYS.WALLET_CONNECT_SESSIONS),
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
    (session: WalletConnectSession) => {
      setWalletConnectSessions((currentSessions) => {
        const newSessions = currentSessions.filter((existing) => existing.id !== session.id);
        newSessions.push(session);
        return newSessions;
      });
    },
    [setWalletConnectSessions],
  );
};

/**
 * Hook that allows to get the currently stored WalletConnect sessions.
 */
export const useWalletConnectSessions = () => useRecoilValue(walletConnectSessionsAppState);
