import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { useSettings } from '@recoil/settings';
import { useAppState, useSetAppState } from '@recoil/appState';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import ROUTES from 'navigation/routes';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { useGetAccounts } from '@recoil/accounts';

const useLockApplicationOnBlur = () => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const settings = useSettings();
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
        setAppState((currentState) => {
          // App is back on focus, check if the app should be locked.
          if (currentState.lastObBlur !== undefined) {
            const deltaSeconds = Math.abs(currentState.lastObBlur - new Date()) / 1000;
            if (deltaSeconds >= 0) {
              return {
                ...currentState,
                noLockOnBackground: false,
                // Lock only if we shouldn't ignore the app state change.
                locked: !currentState.noLockOnBackground,
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
    }); // ;

    return () => {
      onChangeSubscription.remove();
    };
  }, [accounts, setAppState, settings.appInactivityLockSeconds]);

  useEffect(() => {
    if (appState.locked) {
      navigation.navigate(ROUTES.UNLOCK_APPLICATION);
    }
  }, [appState, navigation]);
};

export default useLockApplicationOnBlur;
