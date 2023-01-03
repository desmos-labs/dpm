import { LedgerSigner } from '@cosmjs/ledger-amino';
import { OfflineSigner } from '@cosmjs/proto-signing';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback } from 'react';
import {
  AccountScreensStackParams,
  AuthorizeOperationResolveParams,
  RootStackParams,
} from 'types/navigation';
import { DesmosLedgerApp } from 'config/LedgerApps';

type NavigationProps = CompositeNavigationProp<
  StackNavigationProp<AccountScreensStackParams>,
  StackNavigationProp<RootStackParams>
>;

/**
 * Hooks that provides a function to unlock and access the user wallet.
 */
export default function useUnlockWallet(): (
  account: any
) => Promise<OfflineSigner | null> {
  const navigation = useNavigation<NavigationProps>();

  return useCallback(
    async (account: any) => {
      if (account.type === 0) {
        return new Promise((resolve, reject) => {
          navigation.navigate({
            name: 'AuthorizeOperation',
            params: {
              address: account.address,
              provideWallet: true,
              resolve: (result: AuthorizeOperationResolveParams) => {
                resolve(result.wallet);
              },
              reject,
            },
          });
        });
      }
      return new Promise((resolve) => {
        navigation.navigate({
          name: 'ConnectToLedgerScreens',
          params: {
            ledgerApp: DesmosLedgerApp,
            autoClose: true,
            onConnectionEstablished: (transport: BluetoothTransport) => {
              resolve(
                new LedgerSigner(transport!, {
                  minLedgerAppVersion: DesmosLedgerApp!.minVersion,
                  ledgerAppName: DesmosLedgerApp!.name,
                  hdPaths: account.hdPath,
                  prefix: 'desmos',
                }),
              );
            },
            onCancel: () => {
              resolve(null);
            },
          },
        });
      });
    },
    [navigation],
  );
}
