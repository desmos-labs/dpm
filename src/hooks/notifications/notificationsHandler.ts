import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidVisibility } from '@notifee/react-native';
import i18next from 'i18next';

/**
 * Function that handles the notifications received from firebase.
 */
const notificationsHandler = async (message: FirebaseMessagingTypes.RemoteMessage) => {
  const permission = await messaging().hasPermission();
  if (
    permission === messaging.AuthorizationStatus.AUTHORIZED ||
    messaging.AuthorizationStatus.PROVISIONAL
  ) {
    const notificationChannelId = message.data?.channel_id ?? 'default';
    const notificationChannelName = i18next.t(`notificationChannels:${notificationChannelId}`);

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: notificationChannelId,
      name: notificationChannelName,
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
