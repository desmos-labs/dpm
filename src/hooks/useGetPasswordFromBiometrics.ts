import { useCallback } from 'react';
import { getBiometricPassword } from 'lib/SecureStorage';
import { BiometricAuthorizations } from 'types/settings';
import { useSetAppState } from '@recoil/appState';
import { Platform } from 'react-native';
import { appStateOnce } from 'lib/AppStateUtils';

const useGetPasswordFromBiometrics = (biometricAuthorization: BiometricAuthorizations) => {
  const setAppState = useSetAppState();

  return useCallback(() => {
    setAppState((currentState) => ({ ...currentState, noSplashScreen: true }));
    if (Platform.OS === 'android') {
      // In android if we are requesting the biometrics shortly after the user have
      // unlocked is phone the application don't show the biometrics popup in this case
      // we don't need to prevent the visualization of the splash screen on the next
      // blur event.
      const cancelSplashIgnore = setTimeout(() => {
        setAppState((currentState) => ({ ...currentState, noSplashScreen: false }));
      }, 500);

      appStateOnce('blur', () => {
        // Application went on blur as expected, cancel the timeout that will
        // force the visualization of the splash screen.
        clearTimeout(cancelSplashIgnore);
      });
    }
    return getBiometricPassword(biometricAuthorization);
  }, [biometricAuthorization, setAppState]);
};

export default useGetPasswordFromBiometrics;
