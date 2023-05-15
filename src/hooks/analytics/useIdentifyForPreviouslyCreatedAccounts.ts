import { useStoredAccountsAddresses } from '@recoil/accounts';
import { useSetting } from '@recoil/settings';
import { useAnalyticsStatus } from '@recoil/analytics';
import React from 'react';
import useIdentifyUser from 'hooks/analytics/useIdentifyUser';

/**
 * Hook to track previously created accounts, this is required in such cases
 * where the user have imported or created accounts before the analytics
 * feature was added.
 */
const useIdentifyForPreviouslyCreatedAccounts = () => {
  const analyticsEnabled = useSetting('analyticsEnabled');
  const storedAccountsAddresses = useStoredAccountsAddresses();
  const [analyticsStatus, setAnalyticsStatus] = useAnalyticsStatus();
  const identifyUser = useIdentifyUser();

  React.useEffect(() => {
    // Don't track if the analytics is disabled.
    if (!analyticsEnabled) {
      return;
    }

    // User creation already tracked.
    if (analyticsStatus.userIdentified) {
      return;
    }

    // Identify for the previously stored accounts.
    identifyUser(storedAccountsAddresses);

    setAnalyticsStatus((currVal) => ({
      ...currVal,
      userIdentified: true,
    }));

    // Disabled exhaustive-deps because we don't want this effect to be executed
    // when the storedAccountsAddresses changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyticsEnabled, analyticsStatus.userIdentified, setAnalyticsStatus, identifyUser]);
};

export default useIdentifyForPreviouslyCreatedAccounts;
