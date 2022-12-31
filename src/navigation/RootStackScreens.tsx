import { NavigationContainer, NavigationContainerRef, Route } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { ModalScreen } from 'modals/ModalScreen';
import { useAppContext } from '../contexts/AppContext';
import { useWalletConnectContext } from '../contexts/WalletConnectContext';
import useInitAppState from '../hooks/useInitAppState';
import { MarkdownText } from '../screens/MarkdownText';
import SplashScreen from '../screens/SplashScreen';
import UnlockApplication from '../screens/UnlockApplication';
import { RootStack, RootStackParams } from '../types/navigation';
import AccountCreationScreens from './AccountCreationScreens';
import AccountScreens from './AccountScreens';
import { ConnectToLedgerScreens } from './ConnectToLedgerScreens';

const RootStackScreens: React.FC = () => {
  const appState = useInitAppState();
  const { accounts, selectedAccount } = useAppContext();
  const { initWalletConnect, initState } = useWalletConnectContext();
  const navigatorRef = useRef<NavigationContainerRef<RootStackParams>>(null);
  const appVisibilityState = useRef(AppState.currentState);
  const [oldRoute, setOldRoute] = useState<Route<string> | undefined>(
    navigatorRef.current?.getCurrentRoute(),
  );
  const [oldState, setOldState] = useState(navigatorRef.current?.getState());
  const [appStateVisible, setAppStateVisible] = useState(appVisibilityState.current);
  useEffect(() => {
    if (!initState.initializing && initState.error) {
      console.error('Error initializing WalletConnect', initState.error);
    }
  }, [initState]);

  useEffect(() => {
    initWalletConnect();
  }, [initWalletConnect]);

  const handleAppStateChange = useCallback(
    (nextAppState: any) => {
      // Application is resumed from background or multitask
      if (appVisibilityState.current === 'background' && nextAppState === 'active') {
        if (!appState.initializing && navigatorRef.current !== null) {
          // There are some accounts, I need to unlock the application
          if (accounts.length) {
            navigatorRef.current.reset({
              index: 0,
              routes: [
                {
                  name: 'UnlockApplication',
                  params: {
                    oldRoute,
                    oldState,
                  },
                },
              ],
            });
            // No account, reset where the user was
          } else if (oldState && oldRoute) {
            navigatorRef.current.reset({
              history: [],
              routeNames: [],
              type: '',
              stale: false,
              index: 0,
              routes: oldState.routes,
              key: oldRoute.key,
            });
          }
        }
      } else if (
        !appState.initializing &&
        navigatorRef.current !== null &&
        appVisibilityState.current !== 'inactive'
      ) {
        if (
          navigatorRef.current.getCurrentRoute()?.name !== 'UnlockApplication' &&
          navigatorRef.current.getCurrentRoute()?.name !== 'SplashScreen'
        ) {
          setOldRoute(navigatorRef.current.getCurrentRoute());
          setOldState(navigatorRef.current.getState());
        }
      }
      appVisibilityState.current = nextAppState;
    },
    [accounts.length, appState.initializing, oldRoute, oldState],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) =>
      handleAppStateChange(nextAppState),
    );
    return () => {
      subscription.remove();
    };
  }, [handleAppStateChange]);

  useEffect(() => {
    if (!appState.initializing && navigatorRef.current !== null) {
      if (accounts.length === 0 || selectedAccount === null) {
        // No account, go to the create account screens
        navigatorRef.current.reset({
          index: 0,
          routes: [{ name: 'AccountCreationScreens' }],
        });
      } else {
        const route = navigatorRef.current.getCurrentRoute();
        const state = navigatorRef.current.getState();
        if (!state) {
          setTimeout(() => {
            if (navigatorRef.current) {
              navigatorRef.current.reset({
                index: 0,
                routes: [
                  {
                    name: 'UnlockApplication',
                  },
                ],
              });
            }
          }, 1000);
        } else {
          const homeRoutes = ['Home', 'Authorization'];
          if (route?.name === undefined || homeRoutes.indexOf(route?.name) === -1) {
            const key = state?.routes.find((r) => r.name === 'AccountScreens')?.key;
            navigatorRef.current.reset({
              index: 0,
              routes: [
                {
                  name: 'AccountScreens',
                  key,
                },
              ],
            });
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState.initializing, navigatorRef, selectedAccount]);

  const fadeNavigation = ({ current }: any) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });

  return (
    <NavigationContainer ref={navigatorRef}>
      <RootStack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <RootStack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{
            cardStyleInterpolator: fadeNavigation,
          }}
        />
        <RootStack.Screen name="AccountScreens" component={AccountScreens} />
        <RootStack.Screen name="AccountCreationScreens" component={AccountCreationScreens} />
        <RootStack.Screen name="ConnectToLedgerScreens" component={ConnectToLedgerScreens} />
        <RootStack.Screen
          name="ModalScreen"
          component={ModalScreen}
          options={{
            presentation: 'transparentModal',
          }}
        />
        <RootStack.Screen name="MarkdownText" component={MarkdownText} />
        <RootStack.Screen
          name="UnlockApplication"
          component={UnlockApplication}
          options={{
            cardStyleInterpolator: fadeNavigation,
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootStackScreens;
