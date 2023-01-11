import { useReturnToCurrentScreen } from 'hooks/useReturnToCurrentScreen';
import { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { Wallet } from 'types/wallet';
import ROUTES from 'navigation/routes';
import { useActiveAccount } from '@recoil/activeAccount';

/**
 * Hooks that provides a function to unlock and access the user wallet.
 * @param address - address of the wallet to unlock, if undefined will
 * be used the address of the current active account
 */
export const useUnlockWallet = (address?: string) => {
  const { returnToCurrentScreen } = useReturnToCurrentScreen();
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const activeAccount = useActiveAccount();

  // Address of the wallet to unlock.
  const toUnlockAddress = useMemo(
    () => address ?? activeAccount?.address,
    [address, activeAccount],
  );

  return useCallback(() => {
    if (toUnlockAddress === undefined) {
      return Promise.reject(new Error('no account selected'));
    }

    return new Promise<Wallet | undefined>((resolve) => {
      navigator.navigate({
        name: ROUTES.UNLOCK_WALLET,
        params: {
          address: toUnlockAddress,
          onSuccess: (wallet) => {
            resolve(wallet);
            returnToCurrentScreen();
          },
          onCancel: () => {
            resolve(undefined);
            returnToCurrentScreen();
          },
        },
      });
    });
  }, [address, returnToCurrentScreen, toUnlockAddress]);
};
