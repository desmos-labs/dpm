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
import * as Sentry from '@sentry/react-native';
// eslint-disable-next-line import/no-unresolved
import { SENTRY_AUTH_TOKEN } from '@env';

Object.assign(process.env, { SENTRY_AUTH_TOKEN });
Sentry.init({
  dsn: 'https://ca4a1761ac6b411f95471cf933b8477f@o4505149831118848.ingest.sentry.io/4505149839048704',
  debug: __DEV__,
});

const AppLockLogic = () => {
  useLockApplicationOnBlur();
  return <></>;
};

const Navigation = () => (
  <NavigationContainer onReady={() => RNBootSplash.hide({ fade: true, duration: 500 })}>
    <AppLockLogic />
    <DesmosPostHogProvider>
      <RootNavigator />
    </DesmosPostHogProvider>
  </NavigationContainer>
);

const App = Sentry.wrap(
  () => (
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
  ),
  {},
);

export default App;
