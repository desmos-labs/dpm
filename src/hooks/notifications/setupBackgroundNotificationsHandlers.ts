import messaging from '@react-native-firebase/messaging';
import notificationsHandler from 'hooks/notifications/notificationsHandler';
import notifee from '@notifee/react-native';

/**
 * Functions that initialize the handlers for listening to
 * events related to notifications emitted while the
 * application is in the background state.
 */
const setupBackgroundNotificationsHandlers = () => {
  messaging().setBackgroundMessageHandler(notificationsHandler);
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('notifee background event', type, detail);
    }
  });
};

export default setupBackgroundNotificationsHandlers;
