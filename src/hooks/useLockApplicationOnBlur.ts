import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { useSettings } from '@recoil/settings';
import { useAppState, useSetAppState } from '@recoil/appState';
import { RefObject, useEffect } from 'react';
import { AppState } from 'react-native';
import ROUTES from 'navigation/routes';
import { NavigationContainerRef } from '@react-navigation/native';

const useLockApplicationOnBlur = (
  navigationRef: RefObject<NavigationContainerRef<RootNavigatorParamList>>,
) => {
  const settings = useSettings();
  const appState = useAppState();
  const setAppState = useSetAppState();

  useEffect(() => {
    const blurSubscription = AppState.addEventListener('blur', () => {
      setAppState((currentState) => ({
        ...currentState,
        lastObBlur: new Date(),
      }));
    });

    const focusSubscription = AppState.addEventListener('focus', () => {
      setAppState((currentState) => {
        // App is back on focus, check if the app should be locked.
        if (currentState.lastObBlur !== undefined) {
          const deltaSeconds = Math.abs(currentState.lastObBlur - new Date()) / 1000;
          console.log('delta seconds', deltaSeconds);
          if (deltaSeconds >= settings.appInactivityLockSeconds) {
            return {
              ...currentState,
              locked: true,
            };
          }
        }
        return currentState;
      });
    });

    return () => {
      blurSubscription.remove();
      focusSubscription.remove();
    };
  }, [setAppState, settings.appInactivityLockSeconds]);

  useEffect(() => {
    if (appState.locked) {
      navigationRef.current?.navigate(ROUTES.UNLOCK_APPLICATION);
    }
  }, [appState, navigationRef]);
};

export default useLockApplicationOnBlur;
