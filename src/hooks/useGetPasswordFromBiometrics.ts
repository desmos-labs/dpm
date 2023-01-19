import { useCallback } from 'react';
import { getBiometricPassword } from 'lib/SecureStorage';
import { BiometricAuthorizations } from 'types/settings';
import { useSetAppState } from '@recoil/appState';
import { Platform } from 'react-native';

const useGetPasswordFromBiometrics = (biometricAuthorization: BiometricAuthorizations) => {
  const setAppState = useSetAppState();

  return useCallback(() => {
    if (Platform.OS === 'ios') {
      setAppState((currentState) => ({ ...currentState, noSplashOnInactive: true }));
    }
    return getBiometricPassword(biometricAuthorization);
  }, [biometricAuthorization, setAppState]);
};

export default useGetPasswordFromBiometrics;
