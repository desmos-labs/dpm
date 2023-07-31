import { DPMUri, DPMUriType, DPMUserAddressUri } from 'types/uri';
import { URL } from 'url';

const DPM_URI_PROTOCOL = 'dpm:';

const parseUserAddressUri = (url: URL): DPMUserAddressUri | undefined => {
  const pathName = url.pathname;
  const [address] = pathName.replace('/', '').split('/');

  if (address !== undefined && address.indexOf('desmos1') === 0 && address.length === 45) {
    // We have a valid address
    return {
      type: DPMUriType.UserAddress,
      address,
    };
  }
  return undefined;
};

/**
 * Function to parse an uri string into a {@link DPMUri} that the application can use to
 * perform an operation.
 * The uri format can be:
 * - dpm://<context>/...data
 * @param uri - The uri to parse.
 */
export const parseDPMUri = (uri: string): DPMUri | undefined => {
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
      case DPMUriType.UserAddress:
        return parseUserAddressUri(parsedUri);
      default:
        return undefined;
    }
  } catch (e) {
    return undefined;
  }
};

/**
 * Function that given a {@link DPMUri} generates its uri representation.
 * @param uri - Uri that will be converted to its string representation.
 */
export const generateDPMUri = (uri: DPMUri): string => {
  switch (uri.type) {
    case DPMUriType.UserAddress:
      return `${DPM_URI_PROTOCOL}//${DPMUriType.UserAddress}/${uri.address}`;
    default:
      throw new Error(`unsupported uri type: ${uri.type}`);
  }
};
