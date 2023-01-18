import useReturnToCurrentScreen from 'hooks/useReturnToCurrentScreen';
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { Wallet } from 'types/wallet';
import ROUTES from 'navigation/routes';
import { useActiveAccount } from '@recoil/activeAccount';
import { SigningMode } from '@desmoslabs/desmjs';

/**
 * Hooks that provides a function to unlock and access a user wallet.
 */
const useUnlockWallet = () => {
  const returnToCurrentScreen = useReturnToCurrentScreen();
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const activeAccount = useActiveAccount();

  return useCallback(
    (toUnlockAddress?: string, signingMode?: SigningMode) => {
      const address = toUnlockAddress ?? activeAccount!.address;

      if (address === undefined) {
        return Promise.reject(new Error('no account selected'));
      }

      return new Promise<Wallet | undefined>((resolve) => {
        navigator.navigate(ROUTES.UNLOCK_WALLET, {
          address,
          onSuccess: (wallet) => {
            resolve(wallet);
            returnToCurrentScreen();
          },
          onCancel: () => {
            resolve(undefined);
            returnToCurrentScreen();
          },
          signingMode,
        });
      });
    },
    [activeAccount, navigator, returnToCurrentScreen],
  );
};

export default useUnlockWallet;
