import { useCallback } from 'react';
import { deleteBiometricAuthorization } from 'lib/SecureStorage';
import { BiometricAuthorizations } from 'types/settings';
import { useSetAppState } from '@recoil/appState';

/**
 * Hook to remove the biometric authentication data, disabling this method.
 */
const useDeletePasswordFromBiometrics = () => {
  const setAppState = useSetAppState();

  return useCallback(
    (biometricAuthorization: BiometricAuthorizations) => {
      setAppState((currentState) => ({ ...currentState, noSplashScreen: true }));
      return deleteBiometricAuthorization(biometricAuthorization);
    },
    [setAppState],
  );
};

export default useDeletePasswordFromBiometrics;
