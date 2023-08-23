import { GenericActionUri, UriAction, UriActionType, UserAddressActionUri } from 'types/uri';
import { ChainType } from 'types/chains';

const DPM_URI_PROTOCOL = 'dpm:';

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

/**
 * Validates if the given address is a valid Desmos Bech32 address.
 * @param address - The address to be validated.
 */
const isAddressValid = (address: any): address is string =>
  typeof address === 'string' && address.indexOf('desmos1') === 0 && address.length === 45;

/**
 * Parse the provided url if represents a valid {@link UserAddressActionUri} or
 * undefined otherwise.
 * @param url - The url to parse.
 */
const parseUserAddressUri = (url: URL): UserAddressActionUri | undefined => {
  const pathName = url.pathname;
  const [address] = pathName.replace('/', '').split('/');

  if (isAddressValid(address)) {
    // We have a valid address
    return {
      type: UriActionType.UserAddress,
      address,
    };
  }
  return undefined;
};

/**
 * Parse the provided url if represents a valid {@link GenericActionUri} or
 * undefined otherwise.
 * @param url - The url to parse.
 */
const parseGenericActionUri = (url: URL): GenericActionUri | undefined => {
  const address = url.searchParams.get('address');
  const chainId = url.searchParams.get('chain_id');

  // Ensure that the address and the chain id are defined and strings.
  if (typeof address !== 'string' || typeof chainId !== 'string') {
    return undefined;
  }

  // Ensure that the provided chain id is "mainnet" or "testnet".
  if (chainId !== ChainType.Mainnet && chainId !== ChainType.Testnet) {
    return undefined;
  }

  // Ensure that the provided address is valid.
  if (!isAddressValid(address)) {
    return undefined;
  }

  return {
    type: UriActionType.Generic,
    address,
    chainId,
  };
};

/**
 * Function to parse an uri string into a {@link UriAction} that the application can use to
 * perform an operation.
 * The uri format can be:
 * - dpm://<context>/...data
 * @param uri - The uri to parse.
 */
export const parseUriAction = (uri: string): UriAction | undefined => {
  try {
    const parsedUri = new URL(uri);

    if (parsedUri.protocol !== DPM_URI_PROTOCOL) {
      return undefined;
    }

    // Extract the uri context.
    let context = parsedUri.hostname;
    if (context.indexOf('/') > 0) {
      [context] = context.split('/');
    }

    switch (context) {
      case UriActionType.UserAddress:
        return parseUserAddressUri(parsedUri);
      case UriActionType.Generic:
        return parseGenericActionUri(parsedUri);
      default:
        return undefined;
    }
  } catch (e) {
    return undefined;
  }
};

/**
 * Function that given a {@link UriAction} generates its uri representation.
 * @param uri - Uri that will be converted to its string representation.
 */
export const uriFromUriAction = (uri: UriAction): string => {
  switch (uri.type) {
    case UriActionType.UserAddress:
      return `${DPM_URI_PROTOCOL}//${UriActionType.UserAddress}/${uri.address}`;
    case UriActionType.Generic:
      return `${DPM_URI_PROTOCOL}//?address=${uri.address}&chain_id=${uri.chainId}`;
    default:
      // @ts-ignore
      throw new Error(`unsupported uri type: ${uri.type}`);
  }
};
