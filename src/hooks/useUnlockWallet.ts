import useReturnToCurrentScreen from 'hooks/useReturnToCurrentScreen';
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { LedgerWallet, Wallet, WalletType } from 'types/wallet';
import ROUTES from 'navigation/routes';
import { useActiveAccount } from '@recoil/activeAccount';
import { OfflineSignerAdapter, SigningMode } from '@desmoslabs/desmjs';
import { useGetUserUnlockedWallet, useSetUnlockedWallet } from '@recoil/wallet';
import useConnectToLedger from 'hooks/useConnectToLedger';
import { LedgerApps } from 'config/LedgerApps';
import { LedgerSigner } from '@cosmjs/ledger-amino';

/**
 * Hooks that provides a function to unlock and access a user wallet.
 */
const useUnlockWallet = () => {
  const returnToCurrentScreen = useReturnToCurrentScreen();
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const activeAccount = useActiveAccount();
  const connectToLedger = useConnectToLedger();
  const setUnlockedWallet = useSetUnlockedWallet();
  const getUnlockedWallet = useGetUserUnlockedWallet();

  return useCallback(
    async (toUnlockAddress?: string, signingMode?: SigningMode): Promise<Wallet | undefined> => {
      const address = toUnlockAddress ?? activeAccount!.address;

      if (address === undefined) {
        return Promise.reject(new Error('no account selected'));
      }
      const previuslyUnlockedWallet = getUnlockedWallet(address);

      if (previuslyUnlockedWallet) {
        // Special case for the Ledger hardware wallet.
        if (previuslyUnlockedWallet.type === WalletType.Ledger) {
          // The Ledger is still connected, lets return the wallet.
          if (previuslyUnlockedWallet.transport.notYetDisconnected) {
            return previuslyUnlockedWallet;
          }

          // The ledger is not connected, reopen the connection.
          const ledgerApp = LedgerApps.find(
            ({ name }) => name === previuslyUnlockedWallet.ledgerAppName,
          )!;
          const ledgerTransport = await connectToLedger(ledgerApp);
          // The user cancelled the connection.
          if (ledgerTransport === undefined) {
            return undefined;
          }

          const newWalletInstance: LedgerWallet = {
            ...previuslyUnlockedWallet,
            signer: new OfflineSignerAdapter(
              new LedgerSigner(ledgerTransport, {
                prefix: previuslyUnlockedWallet.addressPrefix,
                ledgerAppName: ledgerApp.name,
                minLedgerAppVersion: ledgerApp.minVersion,
                hdPaths: [previuslyUnlockedWallet.hdPath],
              }),
            ),
            transport: ledgerTransport,
          };
          setUnlockedWallet(address, newWalletInstance);
          return newWalletInstance;
        }
        return previuslyUnlockedWallet;
      }

      return new Promise<Wallet | undefined>((resolve) => {
        navigator.navigate(ROUTES.UNLOCK_WALLET, {
          address,
          onSuccess: (wallet) => {
            setUnlockedWallet(address, wallet);
            resolve(wallet);
            returnToCurrentScreen();
          },
          onCancel: () => {
            setUnlockedWallet(address, undefined);
            resolve(undefined);
            returnToCurrentScreen();
          },
          signingMode,
        });
      });
    },
    [
      activeAccount,
      connectToLedger,
      getUnlockedWallet,
      navigator,
      returnToCurrentScreen,
      setUnlockedWallet,
    ],
  );
};

export default useUnlockWallet;
