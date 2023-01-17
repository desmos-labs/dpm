import { useCallback } from 'react';
import { deleteBiometricAuthorization } from 'lib/SecureStorage';
import { BiometricAuthorizations } from 'types/settings';
import { useSetAppState } from '@recoil/appState';
import { Platform } from 'react-native';

const useDeletePasswordFromBiometrics = () => {
  const setAppState = useSetAppState();

  return useCallback(
    (biometricAuthorization: BiometricAuthorizations) => {
      if (Platform.OS === 'ios') {
        setAppState((currentState) => ({ ...currentState, noLockOnBackground: true }));
      }

      return deleteBiometricAuthorization(biometricAuthorization);
    },
    [setAppState],
  );
};

export default useDeletePasswordFromBiometrics;
