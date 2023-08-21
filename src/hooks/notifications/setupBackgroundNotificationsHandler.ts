import messaging from '@react-native-firebase/messaging';

/**
 * Functions that initialize the background firebase cloud messaging
 * handler to receive the messages while the application is in background.
 */
const setupBackgroundNotificationsHandler = () => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
    const permission = await messaging().hasPermission();
    if (
      permission === messaging.AuthorizationStatus.AUTHORIZED ||
      messaging.AuthorizationStatus.PROVISIONAL
    ) {
      // We have the permissions to post the notification.
      console.log('notifications permissions granted');
    }
  });
};

export default setupBackgroundNotificationsHandler;
