import 'text-encoding';
import './shim';
import { AppRegistry, LogBox } from 'react-native';
import setupBackgroundNotificationsHandler from 'hooks/notifications/setupBackgroundNotificationsHandler';
import App from './src/App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';
import './src/assets/locales/i18n';
import AppSilent from './src/AppSilent';

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

// Initialize the background notification reception logic.
setupBackgroundNotificationsHandler();

// Fake app spawn if a notification is coming from FCM
function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // Hack to open the app on ios when a notification is received
    return <AppSilent />;
  }

  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
