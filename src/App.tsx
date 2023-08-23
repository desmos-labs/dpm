// eslint-disable-next-line import/no-unresolved
import { SENTRY_AUTH_TOKEN } from '@env';
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
import numbro from 'numbro';
import { getDecimalSeparator, getThousandsSeparator } from 'lib/FormatUtils';
import useCheckKeyChainIntegrity from 'hooks/dataintegrity/useCheckKeyChainIntegrity';
import useInitNotifications from 'hooks/notifications/useInitNotifications';
import branch from 'react-native-branch';
import { parseUriAction, setCachedUriAction } from 'lib/UriActions';

Object.assign(process.env, { SENTRY_AUTH_TOKEN });
Sentry.init({
  dsn: 'https://ca4a1761ac6b411f95471cf933b8477f@o4505149831118848.ingest.sentry.io/4505149839048704',
  debug: __DEV__,
  // Keep Sentry disabled in Debug to avoid crash report caused when we are
  // hot reloading the code and there are some errors.
  enabled: !__DEV__,
  environment: __DEV__ ? 'development' : 'production',
});

// Init numbro with the appropriate decimal separators.
const languageData = numbro.languageData();
numbro.registerLanguage(
  {
    ...languageData,
    delimiters: {
      ...languageData.delimiters,
      decimal: getDecimalSeparator(),
      thousands: getThousandsSeparator(),
    },
  },
  true,
);

// Init branch.
branch.skipCachedEvents();
branch.subscribe(({ params, error }) => {
  if (error === null) {
    const deepLinkPath = params.$deeplink_path;
    if (typeof deepLinkPath === 'string') {
      // Generate the deep link uri using the received path.
      const deepLink = `dpm://${deepLinkPath}`;
      // Parse the action and if defined store it.
      const parsedUriAction = parseUriAction(deepLink);
      if (parsedUriAction !== undefined) {
        setCachedUriAction(parsedUriAction);
      }
    }
  }
});

const AppLockLogic = () => {
  useLockApplicationOnBlur();
  useCheckKeyChainIntegrity();
  useInitNotifications();
  return null;
};

const Navigation = () => (
  <NavigationContainer onReady={() => RNBootSplash.hide({ fade: true, duration: 500 })}>
    <AppLockLogic />
    <DesmosPostHogProvider>
      <RootNavigator />
    </DesmosPostHogProvider>
  </NavigationContainer>
);

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
