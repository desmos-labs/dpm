import { useCallback } from 'react';
import { getBiometricPassword } from 'lib/SecureStorage';
import { BiometricAuthorizations } from 'types/settings';
import { useSetAppState } from '@recoil/appState';

const useGetPasswordFromBiometrics = (biometricAuthorization: BiometricAuthorizations) => {
  const setAppState = useSetAppState();

  return useCallback(() => {
    setAppState((currentState) => ({ ...currentState, noSplashScreen: true }));
    return getBiometricPassword(biometricAuthorization);
  }, [biometricAuthorization, setAppState]);
};

export default useGetPasswordFromBiometrics;
