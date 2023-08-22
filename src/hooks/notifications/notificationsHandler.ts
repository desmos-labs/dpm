import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';

/**
 * Function that handles the notifications received from firebase.
 */
const notificationsHandler = async (message: FirebaseMessagingTypes.RemoteMessage) => {
  const permission = await messaging().hasPermission();
  if (
    permission === messaging.AuthorizationStatus.AUTHORIZED ||
    messaging.AuthorizationStatus.PROVISIONAL
  ) {
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.DEFAULT,
      visibility: AndroidVisibility.PUBLIC,
    });

    // Display the notification
    await notifee.displayNotification({
      title: message.notification?.title,
      body: message.notification?.body,
      android: {
        channelId,
        smallIcon: 'ic_notification',
      },
    });
  }
};

export default notificationsHandler;
