import useResetToScreen from 'hooks/navigation/useResetToScreen';
import ROUTES from 'navigation/routes';
import { useSetActiveAccountAddress } from '@recoil/activeAccount';
import { useDeleteAllAccounts } from '@recoil/accounts';
import { useDeleteAllProfiles } from '@recoil/profiles';
import { useDeleteAllAppLinks } from '@recoil/applicationLinks';
import { useDeleteAllChainLinks } from '@recoil/chainLinks';
import useWalletConnectCloseSession from 'hooks/walletconnect/useWalletConnectCloseSession';
import { useWalletConnectSessions } from '@recoil/walletConnectSessions';
import { useSetSettings } from '@recoil/settings';
import React from 'react';

/**
 * Hook that provides a function that deletes the
 * data stored from the application.
 */
export const useClearAppData = () => {
  const resetToLandingPage = useResetToScreen(ROUTES.LANDING);
  const setActiveAccount = useSetActiveAccountAddress();

  const deleteAccounts = useDeleteAllAccounts();
  const deleteProfiles = useDeleteAllProfiles();
  const deleteAppLinks = useDeleteAllAppLinks();
  const deleteChainLinks = useDeleteAllChainLinks();
  const closeWalletConnectSession = useWalletConnectCloseSession();
  const walletConnectSessions = useWalletConnectSessions();
  const setSettings = useSetSettings();

  return React.useCallback(() => {
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
};
