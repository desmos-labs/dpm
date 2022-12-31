import { LedgerSigner } from '@cosmjs/ledger-amino';
import { OfflineSigner } from '@cosmjs/proto-signing';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback } from 'react';
import { ChainAccount, ChainAccountType } from 'types/chain';
import { DesmosLedgerApp } from 'types/ledger';
import {
  AccountScreensStackParams,
  AuthorizeOperationResolveParams,
  RootStackParams,
} from 'types/navigation';
import toCosmJSHdPath from 'utilils/hdpath';

type NavigationProps = CompositeNavigationProp<
  StackNavigationProp<AccountScreensStackParams>,
  StackNavigationProp<RootStackParams>
>;

/**
 * Hooks that provides a function to unlock and access the user wallet.
 */
export default function useUnlockWallet(): (
  account: ChainAccount
) => Promise<OfflineSigner | null> {
  const navigation = useNavigation<NavigationProps>();

  return useCallback(
    async (account: ChainAccount) => {
      if (account.type === ChainAccountType.Local) {
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
                  hdPaths: [toCosmJSHdPath(account.hdPath)],
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
