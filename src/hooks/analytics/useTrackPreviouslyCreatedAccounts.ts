import { useStoredAccounts } from '@recoil/accounts';
import { useSetting } from '@recoil/settings';
import { useAnalyticsStatus } from '@recoil/analytics';
import useTrackNewAccountAdded from 'hooks/analytics/useTrackNewAccountAdded';
import React from 'react';

/**
 * Hook to track previously created accounts, this is required in such cases
 * where the user have imported or created accounts before the analytics
 * feature was added.
 */
const useTrackPreviouslyCreatedAccounts = () => {
  const analyticsEnabled = useSetting('analyticsEnabled');
  const storedAccounts = useStoredAccounts();
  const [analyticsStatus, setAnalyticsStatus] = useAnalyticsStatus();
  // In this case track all accounts as imported.
  const trackNewAccountAdded = useTrackNewAccountAdded(true);

  React.useEffect(() => {
    // Don't track if the analytics is disabled.
    if (!analyticsEnabled) {
      return;
    }

    // User creation already tracked.
    if (analyticsStatus.trackedOldCreatedAccount) {
      return;
    }

    // Track the previously created accounts.
    Object.values(storedAccounts).forEach((a) => {
      trackNewAccountAdded(a);
    });

    setAnalyticsStatus((currVal) => ({
      ...currVal,
      trackedOldCreatedAccount: true,
    }));

    // Disabled exhaustive-deps because we don't want this effect to be executed
    // when the storedAccounts changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyticsEnabled, analyticsStatus.trackedOldCreatedAccount, setAnalyticsStatus]);
};

export default useTrackPreviouslyCreatedAccounts;
