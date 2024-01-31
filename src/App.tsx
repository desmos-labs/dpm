// eslint-disable-next-line import/no-unresolved
import React from 'react';
import { RecoilRoot } from 'recoil';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from 'navigation/RootNavigator';
import ThemeProvider from 'contexts/ThemeProvider';
import GraphQLClientProvider from 'contexts/GraphQLClientProvider';
import { StatusBar } from 'react-native';
import useLockApplicationOnBlur from 'hooks/useLockApplicationOnBlur';
import RNBootSplash from 'react-native-bootsplash';
import SnackBarProvider from 'lib/SnackBarProvider';
import DesmosPostHogProvider from 'components/DesmosPostHogProvider';
import useCheckKeyChainIntegrity from 'hooks/dataintegrity/useCheckKeyChainIntegrity';
import useInitNotifications from 'hooks/notifications/useInitNotifications';
import { getCachedUriAction, isUriActionPending, onCachedUriActionChange } from 'lib/UriActions';
import { useSetUriAction } from '@recoil/uriaction';

const AppLockLogic = () => {
  useLockApplicationOnBlur();
  useCheckKeyChainIntegrity();
  useInitNotifications();
  return null;
};

const Navigation = () => {
  const setUriAction = useSetUriAction();

  React.useEffect(() => {
    if (isUriActionPending()) {
      const action = getCachedUriAction();
      if (action) {
        setUriAction(action);
      }
    }
    return onCachedUriActionChange(setUriAction);
  }, [setUriAction]);

  return (
    <NavigationContainer onReady={() => RNBootSplash.hide({ fade: true, duration: 500 })}>
      <AppLockLogic />
      <DesmosPostHogProvider>
        <RootNavigator />
      </DesmosPostHogProvider>
    </NavigationContainer>
  );
};

const App = () => (
  <RecoilRoot>
    <GraphQLClientProvider>
      <ThemeProvider>
        <SnackBarProvider>
          <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
          <Navigation />
        </SnackBarProvider>
      </ThemeProvider>
    </GraphQLClientProvider>
  </RecoilRoot>
);

export default App;
