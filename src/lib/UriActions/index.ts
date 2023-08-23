import { UriAction, UriActionType, UserAddressActionUri } from 'types/uri';

const DPM_URI_PROTOCOL = 'dpm:';

const parseUserAddressUri = (url: URL): UserAddressActionUri | undefined => {
  const pathName = url.pathname;
  const [address] = pathName.replace('/', '').split('/');

  if (address !== undefined && address.indexOf('desmos1') === 0 && address.length === 45) {
    // We have a valid address
    return {
      type: UriActionType.UserAddress,
      address,
    };
  }
  return undefined;
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
    default:
      throw new Error(`unsupported uri type: ${uri.type}`);
  }
};
