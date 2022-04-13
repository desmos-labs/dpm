import { useSdkContext } from '@desmoslabs/sdk-react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useWalletConnectContext } from '../contexts/WalletConnectContext';
import useSetting from '../hooks/settings/useSetting';
import useInitAppState from '../hooks/useInitAppState';
import { ModalScreen } from '../modals/ModalScreen';
import { MarkdownText } from '../screens/MarkdownText';
import SplashScreen from '../screens/SplashScreen';
import { RootStack, RootStackParams } from '../types/navigation';
import AccountCreationScreens from './AccountCreationScreens';
import AccountScreens from './AccountScreens';
import { ConnectToLedgerScreens } from './ConnectToLedgerScreens';

const RootStackScreens: React.FC = () => {
  const appState = useInitAppState();
  const { accounts, selectedAccount } = useAppContext();
  const sdkContext = useSdkContext();
  const chainId = useSetting('chainId');
  const { initWalletConnect, initState } = useWalletConnectContext();
  const navigatorRef = useRef<NavigationContainerRef<RootStackParams>>(null);

  useEffect(() => {
    if (!initState.initializing && initState.error) {
      console.error('Error initializing WalletConnect', initState.error);
    }
  }, [initState]);

  useEffect(() => {
    initWalletConnect();
  }, [initWalletConnect]);

  // Navigate to the correct screen after loading all the data.
  useEffect(() => {
    sdkContext.setCurrentChainId(chainId);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState.initializing, navigatorRef, selectedAccount]);

  return (
    <NavigationContainer ref={navigatorRef}>
      <RootStack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <RootStack.Screen name="SplashScreen" component={SplashScreen} />
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
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootStackScreens;
