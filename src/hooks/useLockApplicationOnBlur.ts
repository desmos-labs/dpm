import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { useAppState, useSetAppState } from '@recoil/appState';
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import ROUTES from 'navigation/routes';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { useGetAccounts } from '@recoil/accounts';

const useLockApplicationOnBlur = () => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const appState = useAppState();
  const setAppState = useSetAppState();
  const accounts = useGetAccounts();

  useEffect(() => {
    const onChangeSubscription = AppState.addEventListener('change', (state) => {
      console.log('AppState change', state);

      if (Object.keys(accounts).length === 0) {
        console.log('ignore app state change, no accounts');
        return;
      }

      if (state === 'active') {
        const navigationState = navigation.getState();
        if (navigationState !== undefined) {
          const routesCount = navigationState.routes.length;
          if (routesCount > 0) {
            const lastRoute = navigationState.routes[routesCount - 1];
            if (lastRoute.name === ROUTES.SPLASH_SCREEN) {
              navigation.goBack();
            }
          }
        }
        setAppState((currentState) => {
          // App is back on focus, check if the app should be locked.
          if (currentState.lastObBlur !== undefined) {
            return {
              ...currentState,
              noLockOnBackground: false,
              // Lock only if we shouldn't ignore the app state change.
              locked: !currentState.noLockOnBackground,
            };
          }
          return currentState;
        });
      } else if (state === 'background') {
        setAppState((currentState) => ({
          ...currentState,
          lastObBlur: new Date(),
        }));
      } else if (state === 'inactive' && Platform.OS === 'ios') {
        setAppState((currentState) => {
          if (!currentState.noSplashOnInactive) {
            navigation.navigate(ROUTES.SPLASH_SCREEN);
          }
          return {
            ...currentState,
            noSplashOnInactive: false,
          };
        });
      }
    });

    return () => {
      onChangeSubscription.remove();
    };
  }, [accounts, navigation, setAppState, appState]);

  useEffect(() => {
    if (appState.locked) {
      navigation.navigate(ROUTES.UNLOCK_APPLICATION);
    }
  }, [appState, navigation, setAppState]);
};

export default useLockApplicationOnBlur;
