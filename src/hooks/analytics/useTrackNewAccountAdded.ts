import React from 'react';
import { usePostHog } from 'posthog-react-native';
import { Account } from 'types/account';
import useGetProfile from 'hooks/profile/useGetProfile';
import { WalletType } from 'types/wallet';

const ACCOUNT_CREATED_EVENT = 'Wallet Created';
const ACCOUNT_IMPORTED_EVENT = 'Wallet Imported';

/**
 * Hook to track that a new account has been added from the user.
 * @param isImported - Tells if the account has been imported or if is
 * a new one that has been created from the user.
 */
const useTrackNewAccountAdded = (isImported: boolean) => {
  const postHog = usePostHog();
  const getProfile = useGetProfile();

  return React.useCallback(
    async (account: Account) => {
      if (!postHog) {
        return;
      }

      const properties: Record<string, any> = {};

      if (!isImported) {
        properties.CreationTime = account.creationTime;
        properties.CreationMethod = account.walletType;
      } else {
        properties.ImportTime = account.creationTime;
        properties.ImportMethod = account.walletType;

        const profile = await getProfile(account.address);
        if (profile.isOk()) {
          properties.HasProfile = profile.value !== undefined;
        }
      }

      if (account.walletType === WalletType.Web3Auth) {
        // Track which login provider has been used.
        properties.Web3AuthProvider = account.loginProvider;
      }

      postHog.capture(isImported ? ACCOUNT_IMPORTED_EVENT : ACCOUNT_CREATED_EVENT, properties);
    },
    [postHog, isImported, getProfile],
  );
};

export default useTrackNewAccountAdded;
