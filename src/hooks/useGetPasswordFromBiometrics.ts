import { useCallback } from 'react';
import { getBiometricPassword } from 'lib/SecureStorage';
import { BiometricAuthorizations } from 'types/settings';
import { useSetAppState } from '@recoil/appState';
import { Platform } from 'react-native';
import { appStateOnce } from 'lib/AppStateUtils';

/**
 * Hook to get the password that is stored in the secure storage and encrypted using the biometrics of the device.
 * @param biometricAuthorization
 */
const useGetPasswordFromBiometrics = (biometricAuthorization: BiometricAuthorizations) => {
  const setAppState = useSetAppState();

  return useCallback(() => {
    setAppState((currentState) => ({ ...currentState, noSplashScreen: true }));
    if (Platform.OS === 'android') {
      // On Android if we are requesting the biometrics shortly after the user has
      // unlocked is phone the application won't show the biometrics popup. In this case
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
