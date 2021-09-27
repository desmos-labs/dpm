/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import SInfo from 'react-native-sensitive-info';
import './shim';

SInfo.setInvalidatedByBiometricEnrollment(true);
AppRegistry.registerComponent(appName, () => App);
