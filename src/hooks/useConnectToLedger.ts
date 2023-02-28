import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useCallback } from 'react';
import { ConnectToLedgerStackParams } from 'navigation/RootNavigator/ConnectToLedgerStack';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import { LedgerApp } from 'types/ledger';
import useReturnToCurrentScreen from 'hooks/useReturnToCurrentScreen';

/**
 * Hook that allows to start the procedure to connect to a Ledger device.
 */
const useConnectToLedger = () => {
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const returnToCurrentScreen = useReturnToCurrentScreen();

  return useCallback(
    (ledgerApp: LedgerApp) =>
      new Promise<BluetoothTransport | undefined>((resolve) => {
        navigator.navigate({
          name: ROUTES.CONNECT_TO_LEDGER_STACK,
          params: {
            ledgerApp,
            onConnect: (transport) => {
              resolve(transport);
              returnToCurrentScreen();
            },
            onCancel: () => {
              resolve(undefined);
              returnToCurrentScreen();
            },
          } as ConnectToLedgerStackParams,
        });
      }),
    [navigator, returnToCurrentScreen],
  );
};

export default useConnectToLedger;
