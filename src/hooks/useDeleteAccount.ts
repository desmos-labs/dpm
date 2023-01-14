import { useCallback } from 'react';
import { useSetProfiles } from '@recoil/profiles';
import { useGetAccounts, useSetAccounts } from '@recoil/accounts';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useActiveAccountAddress, useSetActiveAccountAddress } from '@recoil/activeAccount';
import useWalletConnectCloseAccountSessions from 'hooks/walletconnect/useWalletConnectCloseAccountSessions';

export default function useDeleteAccount() {
  const accounts = useGetAccounts();
  const setAccounts = useSetAccounts();
  const setProfiles = useSetProfiles();
  const activeAccountAddress = useActiveAccountAddress();
  const setActiveAccountAddress = useSetActiveAccountAddress();
  const closeAccountSessions = useWalletConnectCloseAccountSessions();
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  const deleteAccountAndProfileByAddress = useCallback(
    (accountAddress: string) => {
      setAccounts((old) => {
        const newValue = {
          ...old,
        };
        delete newValue[accountAddress];
        return newValue;
      });
      setProfiles((old) => {
        const newValue = {
          ...old,
        };
        delete newValue[accountAddress];
        return newValue;
      });
    },
    [setAccounts, setProfiles],
  );

  return useCallback(
    (accountAddress: string) => {
      closeAccountSessions(accountAddress);
      const accountsCount = Object.keys(accounts).length;
      if (accountsCount === 1 && accounts[accountAddress] !== undefined) {
        navigator.reset({
          index: 0,
          routes: [{ name: ROUTES.LANDING }],
        });
        setActiveAccountAddress(undefined);
      } else if (accountAddress === activeAccountAddress) {
        const newSelectedAccount = Object.keys(accounts).find(
          (address) => address !== accountAddress,
        );
        setActiveAccountAddress(newSelectedAccount!);
      }
      deleteAccountAndProfileByAddress(accountAddress);
    },
    [
      accounts,
      activeAccountAddress,
      deleteAccountAndProfileByAddress,
      navigator,
      setActiveAccountAddress,
    ],
  );
}
