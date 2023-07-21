import useShowModal from 'hooks/useShowModal';
import { useDeleteAllAccounts, useHasAccount } from '@recoil/accounts';
import React from 'react';
import { containsData, SecureStorageKeys } from 'lib/SecureStorage';
import SingleButtonModal from 'modals/SingleButtonModal';
import { useSetActiveAccountAddress } from '@recoil/activeAccount';
import useResetToScreen from 'hooks/navigation/useResetToScreen';
import ROUTES from 'navigation/routes';
import { useDeleteAllProfiles } from '@recoil/profiles';
import { useDeleteAllAppLinks } from '@recoil/applicationLinks';
import { useDeleteAllChainLinks } from '@recoil/chainLinks';
import useWalletConnectCloseSession from 'hooks/walletconnect/useWalletConnectCloseSession';
import { useWalletConnectSessions } from '@recoil/walletConnectSessions';
import { useTranslation } from 'react-i18next';
import { useSetSettings } from '@recoil/settings';

const useCheckKeyChainIntegrity = () => {
  const { t } = useTranslation('dataIntegrity');
  const showModal = useShowModal();
  const hasAccount = useHasAccount();
  const resetToLandingPage = useResetToScreen(ROUTES.LANDING);
  const setActiveAccount = useSetActiveAccountAddress();

  const deleteAccounts = useDeleteAllAccounts();
  const deleteProfiles = useDeleteAllProfiles();
  const deleteAppLinks = useDeleteAllAppLinks();
  const deleteChainLinks = useDeleteAllChainLinks();
  const closeWalletConnectSession = useWalletConnectCloseSession();
  const walletConnectSessions = useWalletConnectSessions();
  const setSettings = useSetSettings();

  const clearData = React.useCallback(() => {
    deleteAccounts();
    deleteProfiles();
    deleteAppLinks();
    deleteChainLinks();
    setActiveAccount(undefined);
    // Reset the settings that depends on the secure storage.
    setSettings((currVal) => ({
      ...currVal,
      unlockWalletWithBiometrics: false,
      loginWithBiometrics: false,
    }));
    // Close all the WalletConnect sessions.
    Object.values(walletConnectSessions)
      .flatMap((sessions) => sessions)
      .forEach((session) => {
        closeWalletConnectSession(session).catch(() => {
          // Ignore the exception.
        });
      });
    // Return to the landing page.
    resetToLandingPage();
  }, [
    closeWalletConnectSession,
    deleteAccounts,
    deleteAppLinks,
    deleteChainLinks,
    deleteProfiles,
    resetToLandingPage,
    setActiveAccount,
    setSettings,
    walletConnectSessions,
  ]);

  React.useEffect(() => {
    (async () => {
      if (hasAccount) {
        // Since the user have at least one account the password challenge
        // should exist in the secure storage.
        const passwordChallengeExists = await containsData(SecureStorageKeys.PASSWORD_CHALLENGE);
        if (!passwordChallengeExists) {
          // The password challenge don't exist, this means that the secure
          // storage is in an incorrect state, this can be caused
          // from the migration that we made from the Forbole Limited
          // organization to the Desmos Labs on the Apple Store.
          showModal(SingleButtonModal, {
            title: t('keychain corrupted'),
            message: t('keychain corrupted description'),
            actionLabel: t('common:ok'),
            action: clearData,
          });
        }
      }
    })();
    // Safe to ignore we want to execute this hook just one time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useCheckKeyChainIntegrity;
