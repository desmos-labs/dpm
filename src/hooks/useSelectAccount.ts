import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useCallback } from 'react';
import { AccountPickerParams } from 'screens/SelectAccount/components/AccountPicker/types';
import { AccountWithWallet } from 'types/account';

export interface ResultCallbacks {
  onSuccess: (account: AccountWithWallet) => any;
  onCancel?: () => any;
}

const useSelectAccount = () => {
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

export default useSelectAccount;
