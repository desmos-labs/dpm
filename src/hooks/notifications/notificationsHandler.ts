import messaging, { RemoteMessage } from '@react-native-firebase/messaging';

/**
 * Function that handles the notifications received from firebase.
 * @param message
 */
const notificationsHandler = async (message: RemoteMessage) => {
  console.log('Received a message', message);
  const permission = await messaging().hasPermission();
  if (
    permission === messaging.AuthorizationStatus.AUTHORIZED ||
    messaging.AuthorizationStatus.PROVISIONAL
  ) {
    // We have the permissions to post the notification.
    console.log('notifications permissions granted');
  }
};

export default notificationsHandler;
