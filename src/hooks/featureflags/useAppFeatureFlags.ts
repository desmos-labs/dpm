import React from 'react';
import { useCachedFeatureFlags } from '@recoil/featureFlags';
import useFetchAppFeatureFlags from './useFetchAppFeatureFlags';

/**
 * Hook that provides the application feature flags.
 */
const useAppFeatureFlags = () => {
  const fetchFeatureFlags = useFetchAppFeatureFlags();
  const [appFeatureFlags] = useCachedFeatureFlags();

  React.useEffect(() => {
    fetchFeatureFlags();
  }, [fetchFeatureFlags]);

  return appFeatureFlags;
};

export default useAppFeatureFlags;
