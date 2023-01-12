import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { WalletConnectClient, WalletConnectRequest } from 'types/walletConnect';

/**
 * Atom that contains the WalletConnect client.
 * If this client is undefined means that the client is not connected.
 */
const walletConnectClientAppState = atom<WalletConnectClient | undefined>({
  key: 'walletConnectClientAppState',
  default: undefined,
  dangerouslyAllowMutability: true,
});

export const useWalletConnectClient = () => useRecoilValue(walletConnectClientAppState);

export const useSetWalletConnectClient = () => useSetRecoilState(walletConnectClientAppState);

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
