import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useCallback } from 'react';
import { useReturnToCurrentScreen } from 'hooks/useReturnToCurrentScreen';
import { WalletPickerParams } from 'screens/SelectAccount/components/AccountPicker/types';
import { AccountWithWallet } from 'types/account';

export const useSelectAccount = () => {
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const { returnToCurrentScreen } = useReturnToCurrentScreen();

  const selectAccount = useCallback(
    (walletPickerParams: WalletPickerParams): Promise<AccountWithWallet | undefined> =>
      new Promise<AccountWithWallet | undefined>((resolve) => {
        navigator.navigate({
          name: ROUTES.SELECT_ACCOUNT,
          params: {
            walletPickerParams,
            onSelect: (account) => {
              resolve(account);
              returnToCurrentScreen();
            },
            onCancel: () => {
              resolve(undefined);
              returnToCurrentScreen();
            },
          },
        });
      }),
    [navigator],
  );

  return {
    selectAccount,
  };
};
