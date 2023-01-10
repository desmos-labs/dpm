import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  WalletConnectClient,
  WalletConnectRequest,
  WalletConnectSession,
  WalletConnectSessionProposal,
} from 'types/walletConnect';
import {
  convertWalletConnectSession,
  convertWalletConnectSessionProposal,
} from 'lib/WalletConnectUtils';

/**
 * Atom that contains the WalletConnect client.
 * If this client is undefined means that the client is not connected.
 */
const walletConnectClientAppState = atom<WalletConnectClient | undefined>({
  key: 'walletConnectClientAppState',
  default: undefined,
});

/**
 * Selector that provides the WalletConnect sessions.
 */
const walletConnectSessionsAppState = selector<WalletConnectSession[]>({
  key: 'walletConnectSessionsAppState',
  get: ({ get }) => {
    const client = get(walletConnectClientAppState);
    return client?.client.session.values.map(convertWalletConnectSession) ?? [];
  },
});

/**
 * Selector that provides the WalletConnect session proposals.
 */
const walletConnectSessionProposalsAppState = selector<WalletConnectSessionProposal[]>({
  key: 'walletConnectSessionProposalsAppState',
  get: ({ get }) => {
    const client = get(walletConnectClientAppState);
    return client?.client.proposal.values.map(convertWalletConnectSessionProposal) ?? [];
  },
});

/**
 * Atom that holds the requests received from WalletConnect
 * that need to be handled.
 */
const walletConnectSessionRequestsAppState = atom<WalletConnectRequest[]>({
  key: 'walletConnectSessionRequestsAppState',
  default: [],
});

export const useWalletConnectClient = () => useRecoilValue(walletConnectClientAppState);

export const useSetWalletConnectClient = () => useSetRecoilState(walletConnectClientAppState);

export const useWalletConnectClientState = () => useRecoilState(walletConnectClientAppState);

export const useWalletConnectSessions = () => useRecoilValue(walletConnectSessionsAppState);

export const useWalletConnectSessionProposals = () =>
  useRecoilValue(walletConnectSessionProposalsAppState);

export const useWalletConnectSessionRequests = () =>
  useRecoilValue(walletConnectSessionRequestsAppState);

export const useSetWalletConnectSessionRequests = () =>
  useSetRecoilState(walletConnectSessionRequestsAppState);

export const useWalletConnectSessionRequestsState = () =>
  useRecoilState(walletConnectSessionRequestsAppState);
