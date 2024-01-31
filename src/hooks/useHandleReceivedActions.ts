import { useAppState } from '@recoil/appState';
import { useUriAction } from '@recoil/uriaction';
import { useAllWalletConnectSessionsRequests } from '@recoil/walletConnectRequests';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import ROUTES from 'navigation/routes';
import useHandleUriAction from './uriactions/useHandleUriAction';

/**
 * Hook that provides the logic to handle the requests received
 * while the application was in background.
 * The actions that the app can receive while in background are:
 * - URIActions triggered by a deep link or from a system intent;
 * - WalletConnect session requests.
 */
export default function useHandleReceivedActions() {
  const appState = useAppState();

  const uriAction = useUriAction();
  const handlingUriAction = React.useRef(false);
  const handleUriAction = useHandleUriAction();

  const walletConnectRequests = useAllWalletConnectSessionsRequests();
  const handlingWalletConnectRequests = React.useRef(false);
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  React.useEffect(() => {
    // Prevent the execution if we are already handling an action.
    if (handlingUriAction.current) {
      if (uriAction === undefined) {
        handlingUriAction.current = false;
      } else {
        return;
      }
    }

    // Prevent the execution if we are handling the WalletConnect requests.
    if (handlingWalletConnectRequests.current) {
      if (walletConnectRequests.length === 0) {
        handlingWalletConnectRequests.current = false;
      } else {
        return;
      }
    }

    // Ensure that the app is active and unlocked before performing any operation.
    if (appState.locked === false && appState.lastObBlur === undefined) {
      // We give priority to uri actions received from a deep link
      // or a system intent.
      if (uriAction !== undefined) {
        handleUriAction(uriAction);
        handlingUriAction.current = true;
        return;
      }

      if (walletConnectRequests.length > 0) {
        // Navigate to the screen that handle the WalletConnect requests.
        navigation.navigate(ROUTES.WALLET_CONNECT_REQUEST);
        handlingWalletConnectRequests.current = true;
      }
    }
  }, [
    appState.lastObBlur,
    appState.locked,
    handleUriAction,
    navigation,
    uriAction,
    walletConnectRequests,
  ]);
}
