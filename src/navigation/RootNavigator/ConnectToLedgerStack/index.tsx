import React, { FC } from 'react';
import { LedgerApp } from 'types/ledger';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import ROUTES from 'navigation/routes';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import PerformLedgerScan from 'screens/PerformLedgerScan';
import ConnectToLedger, { ConnectToLedgerParams } from 'screens/ConnectToLedger';

export interface ConnectToLedgerStackParams {
  readonly ledgerApp: LedgerApp;
  readonly onConnect: (transport: BluetoothTransport) => any;
  readonly onCancel?: () => any;
}

export type ConnectToLedgerStackParamList = {
  [ROUTES.PERFORM_LEDGER_SCAN]: ConnectToLedgerStackParams;
  [ROUTES.CONNECT_TO_LEDGER]: ConnectToLedgerParams;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.CONNECT_TO_LEDGER_STACK>;

const Stack = createStackNavigator<ConnectToLedgerStackParamList>();

const ConnectToLedgerStack: FC<NavProps> = ({ route }) => (
  <Stack.Navigator
    initialRouteName={ROUTES.PERFORM_LEDGER_SCAN}
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen
      name={ROUTES.PERFORM_LEDGER_SCAN}
      component={PerformLedgerScan}
      initialParams={route.params}
    />
    <Stack.Screen name={ROUTES.CONNECT_TO_LEDGER} component={ConnectToLedger} />
  </Stack.Navigator>
);

export default ConnectToLedgerStack;
