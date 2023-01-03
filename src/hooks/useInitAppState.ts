import { useEffect } from 'react';
import useAppContext, { InitState } from 'contexts/AppContext';
import AccountSource from 'sources/AccountSource';
import { LocalWalletsSource } from 'sources/LocalWalletsSource';
import ProfileSource from 'sources/ProfileSource';
import * as SecureStorage from 'lib/SecureStorage';
import useConnectDesmosClient from './desmosclient/useConnectDesmosClient';
import useLoadAllProfiles from './useLoadAllProfiles';

/**
 * Hook that initialize the application state.
 * Returns a stateful variable that provides the initialization status.
 */
export default function useInitAppState(): InitState {
  const { initializing, setInitializing } = useAppContext();

  const loadProfiles = useLoadAllProfiles();
  const connectDesmosClient = useConnectDesmosClient();

  useEffect(() => {
    (async () => {
      try {
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

        // Load profiles and settings from disk.
        await loadProfiles();
        await connectDesmosClient();
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
  }, []);

  return initializing;
}
