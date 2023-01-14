import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { WalletConnectClient } from 'types/walletConnect';

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
