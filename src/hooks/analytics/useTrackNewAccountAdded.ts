import React from 'react';
import { Account } from 'types/account';
import useGetProfile from 'hooks/profile/useGetProfile';
import { WalletType } from 'types/wallet';
import useTrackEvent from 'hooks/analytics/useTrackEvent';
import { Events } from 'types/analytics';

/**
 * Hook to track that a new account has been added from the user.
 * @param isImported - Tells if the account has been imported or if is
 * a new one that has been created from the user.
 */
const useTrackNewAccountAdded = (isImported: boolean) => {
  const trackEvent = useTrackEvent();
  const getProfile = useGetProfile();

  return React.useCallback(
    async (account: Account) => {
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

      trackEvent(isImported ? Events.AccountImported : Events.AccountCreated, properties);
    },
    [isImported, trackEvent, getProfile],
  );
};

export default useTrackNewAccountAdded;
