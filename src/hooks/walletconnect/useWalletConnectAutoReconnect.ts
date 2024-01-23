import React from 'react';
import { useSetWalletConnectClientState, useWalletConnectClientState } from '@recoil/walletconnect';
import { WalletConnectClientStatus } from 'types/walletConnect';
import { useNetInfo } from '@react-native-community/netinfo';
import { useConnectWalletConnect } from './useConnectWalletConnect';

/**
 * Hook that initialize the logic to automatically reconnect
 *  the WalletConnect client if it disconnects.
 */
const useWalletConnectAutoReconnect = () => {
  const walletConnectState = useWalletConnectClientState();
  const setWalletConnectState = useSetWalletConnectClientState();
  const connectWalletConnect = useConnectWalletConnect();
  const [reconnecting, setReconnecting] = React.useState(false);
  const timeoutRef = React.useRef<any>();
  const { isInternetReachable } = useNetInfo();

  const periodicReconnect = React.useCallback(async () => {
    setReconnecting(true);
    // Clear any previous timeout.
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    // Try to connect.
    const connectResult = await connectWalletConnect();
    if (connectResult.isErr()) {
      // The connection failed, retry in 5s
      timeoutRef.current = setTimeout(periodicReconnect, 5000);
    }
    setReconnecting(false);
  }, [connectWalletConnect]);

  React.useEffect(() => {
    if (isInternetReachable) {
      // If there is internet and the client is disconnected and we
      // are not currently connecting, try to connect.
      if (
        walletConnectState.status === WalletConnectClientStatus.Disconnected &&
        !reconnecting &&
        timeoutRef.current === undefined
      ) {
        periodicReconnect();
      }
    } else if (walletConnectState.status !== WalletConnectClientStatus.Disconnected) {
      // If there is no internet and the client is connected set it as disconnected.
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
      setWalletConnectState({ status: WalletConnectClientStatus.Disconnected });
    }
  }, [
    reconnecting,
    isInternetReachable,
    periodicReconnect,
    setWalletConnectState,
    walletConnectState.status,
  ]);
};

export default useWalletConnectAutoReconnect;
