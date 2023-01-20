import { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { useHasAccount } from '@recoil/accounts';
import { AccountWithWallet } from 'types/account';
import ROUTES from 'navigation/routes';

const useSaveAccount = () => {
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const hasAccount = useHasAccount();
  const createWalletPassword = useMemo(() => hasAccount, [hasAccount]);

  return useCallback(
    (account: AccountWithWallet) => {
      if (createWalletPassword) {
        navigator.navigate({
          name: ROUTES.CREATE_WALLET_PASSWORD,
          params: {
            account,
          },
        });
      } else {
        navigator.navigate({
          name: ROUTES.CHECK_WALLET_PASSWORD,
          params: {
            account,
          },
        });
      }
    },
    [navigator, createWalletPassword],
  );
};

export default useSaveAccount;
