import { useCallback } from 'react';
import { useDeleteProfile } from '@recoil/profiles';
import { useDeleteAccount, useStoredAccounts, useStoredAccountsNumber } from '@recoil/accounts';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useActiveAccountAddress, useSetActiveAccountAddress } from '@recoil/activeAccount';
import useWalletConnectCloseAccountSessions from 'hooks/walletconnect/useWalletConnectCloseAccountSessions';
import { useDeleteChainLinks } from '@recoil/chainLinks';
import { useDeleteApplicationLinks } from '@recoil/applicationLinks';

const useRemoveAccount = () => {
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  const activeAccountAddress = useActiveAccountAddress();
  const setActiveAccountAddress = useSetActiveAccountAddress();

  const accounts = useStoredAccounts();
  const accountsNumber = useStoredAccountsNumber();

  const deleteAccount = useDeleteAccount();
  const deleteProfile = useDeleteProfile();
  const deleteChainLinks = useDeleteChainLinks();
  const deleteApplicationLinks = useDeleteApplicationLinks();

  const closeAccountSessions = useWalletConnectCloseAccountSessions();

  return useCallback(
    (address: string) => {
      // Delete the account, profile and all other data
      deleteAccount(address);
      deleteProfile(address);
      deleteChainLinks(address);
      deleteApplicationLinks(address);

      // Close the WalletConnect sessions
      closeAccountSessions(address);

      if (accountsNumber === 1 && accounts[address] !== undefined) {
        // If the accounts number was 1 and the account with the deleted address exists,
        // it means we are deleting the only account stored. This means we need to navigate back to the
        // landing page, and set the active account address as undefined.
        setActiveAccountAddress(undefined);
        navigator.reset({
          index: 0,
          routes: [{ name: ROUTES.LANDING }],
        });
      } else if (address === activeAccountAddress) {
        // If the address of the deleted account is the active one, we need to find the new
        // active account by searching the first one that is not equals to the one deleted.
        const newSelectedAccount = Object.keys(accounts).find((a) => a !== address);
        setActiveAccountAddress(newSelectedAccount!);
      }
    },
    [
      accounts,
      accountsNumber,
      activeAccountAddress,
      closeAccountSessions,
      deleteAccount,
      deleteApplicationLinks,
      deleteChainLinks,
      deleteProfile,
      navigator,
      setActiveAccountAddress,
    ],
  );
};

export default useRemoveAccount;
