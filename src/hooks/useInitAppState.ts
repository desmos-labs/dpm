import { useEffect } from 'react';
import useLoadAccounts from './useLoadAccounts';
import { useInitI18n } from '../i18n/i18n';
import useLoadAllProfiles from './useLoadAllProfiles';
import { InitState, useAppContext } from '../contexts/AppContext';
import useLoadSettings from './settings/useLoadSettings';
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
				// Load accounts and profiles from disk.
				const accounts = await loadAccounts();
				await loadProfiles();
				await loadSettings();
				await loadChainLinks(
					accounts.accounts.map((account) => account.address)
				);

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
