import React from 'react';
import { usePostHog } from 'posthog-react-native';
import { AccountWithWallet } from 'types/account';
import useGetProfile from 'hooks/profile/useGetProfile';
import useGetBalance from 'hooks/balance/useGetBalance';

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
  const getBalance = useGetBalance();

  return React.useCallback(
    async (account: AccountWithWallet) => {
      if (!postHog) {
        return;
      }

      const properties: Record<string, any> = {
        CreationTime: new Date().toISOString(),
        CreationMethod: account.wallet.type,
        Address: account.account.address,
      };

      const profile = await getProfile(account.account.address);
      if (profile.isOk()) {
        properties.HasProfile = profile.value !== undefined;
        if (profile.value !== undefined) {
          properties.ProfileDTag = profile.value.dtag;
        }
      }

      const balance = await getBalance(account.account.address);
      if (balance.isOk()) {
        properties.Balance = balance.value;
      }

      postHog.capture(isImported ? ACCOUNT_IMPORTED_EVENT : ACCOUNT_CREATED_EVENT, properties);
    },
    [isImported, getProfile, getBalance, postHog],
  );
};

export default useTrackNewAccountAdded;
