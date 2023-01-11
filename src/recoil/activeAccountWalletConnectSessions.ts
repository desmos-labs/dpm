import { selector, useRecoilValue } from 'recoil';
import { WalletConnectSession } from 'types/walletConnect';
import { activeAccountAddressAppState } from '@recoil/activeAccount';
import { walletConnectSessionsAppState } from '@recoil/walletConnectSessions';

/**
 * Selector that provides the WalletConnect sessions for the current selected account.
 * This should not be confused with the walletConnectSessions' atom, which contains data
 * for ALL the WalletConnect sessions stored on the user's device
 */
const activeAccountWalletConnectSessions = selector<WalletConnectSession[]>({
  key: 'activeAccountWalletConnectSessions',
  get: ({ get }) => {
    const sessions = get(walletConnectSessionsAppState);
    const selectedAccountAddress = get(activeAccountAddressAppState);
    return selectedAccountAddress ? sessions[selectedAccountAddress] || [] : [];
  },
});

/**
 * Hook that allows to get the WalletConnect sessions for the currently active account.
 */
export const useActiveAccountWalletConnectSessions = () =>
  useRecoilValue(activeAccountWalletConnectSessions);
