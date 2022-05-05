import 'text-encoding';
import './shim';
import { AppRegistry, LogBox } from 'react-native';
// import SInfo from 'react-native-sensitive-info';
import App from './src/App';
import { name as appName } from './app.json';
import 'react-native-gesture-handler';

/* SInfo.hasEnrolledFingerprints().then((enrolled) => {
  if (enrolled) {
    SInfo.setInvalidatedByBiometricEnrollment(true);
  }
}); */

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);
AppRegistry.registerComponent(appName, () => App);
