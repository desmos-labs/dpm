import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useCallback } from 'react';
import { AccountPickerParams } from 'screens/SelectAccount/components/AccountPicker/types';
import { AccountWithWallet } from 'types/account';

interface ResultCallbacks {
  onSuccess: (accounts: AccountWithWallet[]) => any;
  onCancel?: () => any;
}

/**
 * Hook that provides a function that will present to the user
 * a screen from which they can select a list of accounts.
 */
const useSelectAccounts = () => {
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  return useCallback(
    (accountPickerParams: AccountPickerParams, callbacks: ResultCallbacks): void =>
      navigator.navigate({
        name: ROUTES.SELECT_ACCOUNT,
        params: {
          accountPickerParams,
          onSelect: callbacks.onSuccess,
          onCancel: callbacks.onCancel,
        },
      }),
    [navigator],
  );
};

export default useSelectAccounts;
