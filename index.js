// eslint-disable-next-line import/no-unresolved
import { SENTRY_AUTH_TOKEN } from '@env';
import 'text-encoding';
import './shim';
import { AppRegistry, LogBox } from 'react-native';
import setupBackgroundNotificationsHandlers from 'hooks/notifications/setupBackgroundNotificationsHandlers';
import branch from 'react-native-branch';
import { actionUriFromRecord, setCachedUriAction } from 'lib/UriActions';
import 'react-native-gesture-handler';
import './src/assets/locales/i18n';
import * as Sentry from '@sentry/react-native';
import numbro from 'numbro';
import { getDecimalSeparator, getThousandsSeparator } from 'lib/FormatUtils';
import AppSilent from './src/AppSilent';
import { name as appName } from './app.json';
import App from './src/App';

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

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

// Initialize the background notification reception logic.
setupBackgroundNotificationsHandlers();

// Init branch.
branch.subscribe(({ params, error }) => {
  if (error === null) {
    const parsedUriAction = actionUriFromRecord(params);
    if (parsedUriAction !== undefined) {
      setCachedUriAction(parsedUriAction);
    }
  }
});

// Fake app spawn if a notification is coming from FCM
function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // Hack to open the app on ios when a notification is received
    return <AppSilent />;
  }

  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
