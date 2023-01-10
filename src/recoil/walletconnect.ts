import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  WalletConnectClient,
  WalletConnectRequest,
  WalletConnectSessionProposal,
} from 'types/walletConnect';
import { convertWalletConnectSessionProposal } from 'lib/WalletConnectUtils';

/**
 * Atom that contains the WalletConnect client.
 * If this client is undefined means that the client is not connected.
 */
const walletConnectClientAppState = atom<WalletConnectClient | undefined>({
  key: 'walletConnectClientAppState',
  default: undefined,
});

export const useWalletConnectClient = () => useRecoilValue(walletConnectClientAppState);

export const useSetWalletConnectClient = () => useSetRecoilState(walletConnectClientAppState);

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

export const useWalletConnectSessionProposals = () =>
  useRecoilValue(walletConnectSessionProposalsAppState);

/**
 * Atom that holds the requests received from WalletConnect
 * that need to be handled.
 */
const walletConnectSessionRequestsAppState = atom<WalletConnectRequest[]>({
  key: 'walletConnectSessionRequestsAppState',
  default: [],
});

export const useWalletConnectSessionRequests = () =>
  useRecoilValue(walletConnectSessionRequestsAppState);

export const useSetWalletConnectSessionRequests = () =>
  useSetRecoilState(walletConnectSessionRequestsAppState);
