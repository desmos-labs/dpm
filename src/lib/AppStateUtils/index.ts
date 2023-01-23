import { AppState, AppStateEvent, AppStateStatus } from 'react-native';

/**
 * Function to subscribe to an AppState event just for one event change.
 * @param type - App state event.
 * @param listener - Callback called on when the event is fired.
 */
export const appStateOnce = (type: AppStateEvent, listener: (state: AppStateStatus) => void) => {
  const subscription = AppState.addEventListener(type, (state: AppStateStatus) => {
    listener(state);
    subscription.remove();
  });
};
