import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { useHasAccount } from '@recoil/accounts';
import { AccountWithWallet } from 'types/account';
import ROUTES from 'navigation/routes';

/**
 * Hook that allows the user to see the last screen of the account saving flow.
 * This redirects them to the proper screen that will either:
 * a. ask them to create a password for the wallet, if it's the first account they are saving
 * b. ask them to enter their password, if they already have an account saved
 *
 * Once the user has entered their password the account will be stored on the device, and they will be
 * redirected to the home screen.
 */
const useSaveGeneratedAccounts = (isImported: boolean) => {
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const hasAccount = useHasAccount();

  return useCallback(
    (accounts: AccountWithWallet[]) => {
      if (!hasAccount) {
        navigator.navigate({
          name: ROUTES.CREATE_WALLET_PASSWORD,
          params: {
            accounts,
            isImported,
          },
        });
      } else {
        navigator.navigate({
          name: ROUTES.CHECK_WALLET_PASSWORD,
          params: {
            accounts,
            isImported,
          },
        });
      }
    },
    [hasAccount, navigator, isImported],
  );
};

export default useSaveGeneratedAccounts;
