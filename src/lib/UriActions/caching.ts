import EventEmitter from 'events';
import { UriAction } from 'types/uri';

let CachedUriAction: UriAction | undefined;

const NEW_ACTION_EVENT = 'new_action';
const UriActionEventEmitter = new EventEmitter();

/**
 * Updates the cached uri action.
 * @param action - The new uri action.
 */
export const setCachedUriAction = (action: UriAction): void => {
  CachedUriAction = action;
  UriActionEventEmitter.emit(NEW_ACTION_EVENT, action);
};

/**
 * Gets the cached uri action.
 * After getting the cached uri action, it will be
 * cleared.
 */
export const getCachedUriAction = (): UriAction | undefined => {
  const action = CachedUriAction;
  CachedUriAction = undefined;
  return action;
};

/**
 * Checks if there is a pending {@link UriAction} that needs
 * to be handled.
 */
export const isUriActionPending = (): boolean => CachedUriAction !== undefined;

/**
 * Function to subscribe to the event raised when a new {@link UriAction}
 * is received.
 * @param callback - Callback that will be called when a new {@link UriAction} is received.
 */
export function onCachedUriActionChange(callback: (action: UriAction) => void) {
  UriActionEventEmitter.addListener(NEW_ACTION_EVENT, callback);
  return () => {
    UriActionEventEmitter.removeListener(NEW_ACTION_EVENT, callback);
  };
}
