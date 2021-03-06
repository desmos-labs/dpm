import { useEffect } from 'react';
import { InitState, useAppContext } from '../contexts/AppContext';
import { useInitI18n } from '../i18n/i18n';
import AccountSource from '../sources/AccountSource';
import { LocalWalletsSource } from '../sources/LocalWalletsSource';
import ProfileSource from '../sources/ProfileSource';
import * as SecureStorage from '../utilils/SecureStorage';
import useLoadSettings from './settings/useLoadSettings';
import useLoadAccounts from './useLoadAccounts';
import useLoadAllProfiles from './useLoadAllProfiles';
import useLoadAllChainLinks from './useLoadChainLinks';

/**
 * Hook that initialize the application state.
 * Returns a stateful variable that provides the initialization status.
 */
export default function useInitAppState(): InitState {
  const { initializing, setInitializing } = useAppContext();

  const initLocalization = useInitI18n();
  const loadAccounts = useLoadAccounts();
  const loadProfiles = useLoadAllProfiles();
  const loadSettings = useLoadSettings();
  const loadChainLinks = useLoadAllChainLinks();

  useEffect(() => {
    (async () => {
      try {
        await initLocalization();
        // Check if using global password
        const usingGlobalPassword = await SecureStorage.getItem('using_global_password');
        if (!usingGlobalPassword) {
          // Wipe the application storage
          await AccountSource.reset();
          await LocalWalletsSource.reset();
          await ProfileSource.reset();
          await SecureStorage.resetSecureStorage();
          // Set new global password flow
          await SecureStorage.setItem('using_global_password', 'using_global_password');
        }
        // Load accounts and profiles from disk.
        const accounts = await loadAccounts();
        await loadProfiles();
        await loadSettings();
        await loadChainLinks(accounts.accounts.map((account) => account.address));
        setInitializing({
          initializing: false,
        });
      } catch (e) {
        setInitializing({
          initializing: false,
          errorMessage: e.toString(),
        });
        console.error(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return initializing;
}
