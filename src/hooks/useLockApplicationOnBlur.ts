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
    const onChangeSubscription = AppState.addEventListener('change', (state) => {
      console.log('app state change', state);
      if (state === 'active') {
        setAppState((currentState) => {
          // App is back on focus, check if the app should be locked.
          if (currentState.lastObBlur !== undefined) {
            const deltaSeconds = Math.abs(currentState.lastObBlur - new Date()) / 1000;
            if (deltaSeconds >= settings.appInactivityLockSeconds) {
              return {
                ...currentState,
                locked: true,
              };
            }
          }
          return currentState;
        });
      } else if (state === 'background') {
        setAppState((currentState) => ({
          ...currentState,
          lastObBlur: new Date(),
        }));
      }
    });

    return () => {
      onChangeSubscription.remove();
    };
  }, [setAppState, settings.appInactivityLockSeconds]);

  useEffect(() => {
    if (appState.locked) {
      navigationRef.current?.navigate(ROUTES.UNLOCK_APPLICATION);
    }
  }, [appState, navigationRef]);
};

export default useLockApplicationOnBlur;
