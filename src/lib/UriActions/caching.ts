import { UriAction } from 'types/uri';

let CachedUriAction: UriAction | undefined;

/**
 * Updates the cached uri action.
 * @param action - The new uri action.
 */
export const setCachedUriAction = (action: UriAction): void => {
  CachedUriAction = action;
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
