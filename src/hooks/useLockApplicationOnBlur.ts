import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { useAppState, useSetAppState } from '@recoil/appState';
import { useCallback, useEffect } from 'react';
import { AppState, NativeEventSubscription, Platform } from 'react-native';
import ROUTES from 'navigation/routes';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { useHasAccount } from '@recoil/accounts';

const useLockApplicationOnBlur = () => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const appState = useAppState();
  const setAppState = useSetAppState();
  const hasAccount = useHasAccount();

  const showSplashScreen = useCallback(() => {
    setAppState((currentState) => {
      if (!currentState.noSplashScreen) {
        navigation.navigate(ROUTES.SPLASH_SCREEN);
      }
      return {
        ...currentState,
        noSplashScreen: false,
      };
    });
  }, [navigation, setAppState]);

  const removeSplashScreen = useCallback(() => {
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
  }, [navigation]);

  useEffect(() => {
    let blurSubscription: NativeEventSubscription | undefined;
    let focusSubscription: NativeEventSubscription | undefined;

    if (Platform.OS === 'android') {
      // Events available only on Android.
      blurSubscription = AppState.addEventListener('blur', () => {
        showSplashScreen();
      });
      focusSubscription = AppState.addEventListener('focus', () => {
        removeSplashScreen();
      });
    }

    const onChangeSubscription = AppState.addEventListener('change', (state) => {
      if (!hasAccount) {
        return;
      }

      if (state === 'active') {
        removeSplashScreen();

        setAppState((currentState) => {
          // App is back on focus, check if the app should be locked.
          if (currentState.lastObBlur !== undefined) {
            return {
              ...currentState,
              noLockOnBackground: false,
              // Lock only if we shouldn't ignore the app state change.
              locked: !currentState.noLockOnBackground,
              lastObBlur: undefined,
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
        showSplashScreen();
      }
    });

    return () => {
      onChangeSubscription.remove();
      blurSubscription?.remove();
      focusSubscription?.remove();
    };
  }, [hasAccount, navigation, setAppState, appState, showSplashScreen, removeSplashScreen]);

  useEffect(() => {
    if (appState.locked) {
      navigation.navigate(ROUTES.UNLOCK_APPLICATION);
    }
  }, [appState, navigation, setAppState]);
};

export default useLockApplicationOnBlur;
