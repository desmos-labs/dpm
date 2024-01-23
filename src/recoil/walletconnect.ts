import { atom, useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
import { WalletConnectClientState, WalletConnectClientStatus } from 'types/walletConnect';

/**
 * Atom that contains the WalletConnect client.
 * If this client is undefined means that the client is not connected.
 */
const walletConnectClientAppState = atom<WalletConnectClientState>({
  key: 'walletConnectClientAppState',
  default: {
    status: WalletConnectClientStatus.Disconnected,
  },
  // We need this because the internal WalletConnect object mutates during the
  // application execution.
  dangerouslyAllowMutability: true,
});

/**
 * Hook that provides the current WalletConnect client state.
 */
export const useWalletConnectClientState = () => useRecoilValue(walletConnectClientAppState);

/**
 * Hook that provides a function to update the WalletConnect client state.
 */
export const useSetWalletConnectClientState = () => useSetRecoilState(walletConnectClientAppState);

/**
 * Hook that provides a function to get the WalletConnect client state.
 */
export const useGetWalletConnectClientState = () =>
  useRecoilCallback(
    ({ snapshot }) =>
      () =>
        snapshot.getPromise(walletConnectClientAppState),
    [],
  );
