import React from 'react';
import useAppFeatureFlags from 'hooks/featureflags/useAppFeatureFlags';
import DeviceInfo from 'react-native-device-info';

/**
 * Hook that tells if the application should
 * hide the social login options.
 */
export const useAreSocialLoginOptionsDisabled = () => {
  const { hideSocialLoginsOnVersion } = useAppFeatureFlags();

  return React.useMemo(
    () => hideSocialLoginsOnVersion === DeviceInfo.getVersion(),
    [hideSocialLoginsOnVersion],
  );
};
