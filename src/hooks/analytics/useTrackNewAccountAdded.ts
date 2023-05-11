import React from 'react';
import { usePostHog } from 'posthog-react-native';
import { AccountWithWallet } from 'types/account';
import useGetProfile from 'hooks/profile/useGetProfile';
import useIsTestnetEvent from 'hooks/analytics/useIsTestnetEvent';

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
  const isTestnetEvent = useIsTestnetEvent();

  return React.useCallback(
    async (account: AccountWithWallet) => {
      if (!postHog || isTestnetEvent) {
        return;
      }

      const properties: Record<string, any> = {};

      if (!isImported) {
        properties.CreationTime = new Date().toISOString();
        properties.CreationMethod = account.wallet.type;
      } else {
        properties.ImportTime = new Date().toISOString();
        properties.ImportMethod = account.wallet.type;

        const profile = await getProfile(account.account.address);
        if (profile.isOk()) {
          properties.HasProfile = profile.value !== undefined;
        }
      }

      postHog.capture(isImported ? ACCOUNT_IMPORTED_EVENT : ACCOUNT_CREATED_EVENT, properties);
    },
    [postHog, isTestnetEvent, isImported, getProfile],
  );
};

export default useTrackNewAccountAdded;
