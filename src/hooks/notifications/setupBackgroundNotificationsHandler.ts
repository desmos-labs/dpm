import messaging from '@react-native-firebase/messaging';
import notificationsHandler from 'hooks/notifications/notificationsHandler';

/**
 * Functions that initialize the background firebase cloud messaging
 * handler to receive the messages while the application is in background.
 */
const setupBackgroundNotificationsHandler = () => {
  messaging().setBackgroundMessageHandler(notificationsHandler);
};

export default setupBackgroundNotificationsHandler;
