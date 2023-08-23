import {
  GenericActionUri,
  SendTokensActionUri,
  UriAction,
  UriActionType,
  UserAddressActionUri,
  ViewProfileActionUri,
} from 'types/uri';
import { ChainType } from 'types/chains';
import { parseCoins } from '@cosmjs/amino';
import { Coin } from '@desmoslabs/desmjs';

const DPM_URI_PROTOCOL = 'dpm:';

/**
 * Validates if the given address is a valid Desmos Bech32 address.
 * @param address - The address to be validated.
 */
const isAddressValid = (address: any): address is string =>
  typeof address === 'string' && address.indexOf('desmos1') === 0 && address.length === 45;

/**
 * Validates if the given chain type is a valid {@link ChainType}.
 * @param chainType - The chain type to be validated.
 */
const isChainTypeValid = (chainType: any): chainType is ChainType =>
  typeof chainType === 'string' &&
  [ChainType.Mainnet, ChainType.Testnet].includes(chainType as ChainType);

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

  // Ensure that the provided chain id is "mainnet" or "testnet".
  if (!isChainTypeValid(chainId)) {
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
 * Parse the provided url if represents a valid {@link ViewProfileActionUri} or
 * undefined otherwise.
 * @param url - The url to parse.
 */
const parseViewProfileAction = (url: URL): ViewProfileActionUri | undefined => {
  const address = url.searchParams.get('address');
  const chainType = url.searchParams.get('chain_type');

  // Ensure that the provided chain type is "mainnet" or "testnet".
  if (!isChainTypeValid(chainType)) {
    return undefined;
  }

  // Ensure that the provided address is valid.
  if (!isAddressValid(address)) {
    return undefined;
  }

  return {
    type: UriActionType.ViewProfile,
    address,
    chainType,
  };
};

/**
 * Parse the provided url if represents a valid {@link SendTokensActionUri} or
 * undefined otherwise.
 * @param url - The url to parse.
 */
const parseSendTokensActionUri = (url: URL): SendTokensActionUri | undefined => {
  const address = url.searchParams.get('address');
  const chainType = url.searchParams.get('chain_type');
  const rawAmount = url.searchParams.get('amount');

  // Ensure that the provided chain type is "mainnet" or "testnet".
  if (!isChainTypeValid(chainType)) {
    return undefined;
  }

  // Ensure that the provided address is valid.
  if (!isAddressValid(address)) {
    return undefined;
  }

  // Try to parse the amount if is defined.
  let amount: Coin | undefined;
  if (typeof rawAmount === 'string') {
    try {
      [amount] = parseCoins(rawAmount);
    } catch (e) {
      return undefined;
    }
  }

  return {
    type: UriActionType.SendTokens,
    amount,
    chainType,
    address,
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
      case UriActionType.ViewProfile:
        return parseViewProfileAction(parsedUri);
      case UriActionType.SendTokens:
        return parseSendTokensActionUri(parsedUri);
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
    case UriActionType.ViewProfile:
      return `${DPM_URI_PROTOCOL}//${UriActionType.ViewProfile}?address=${uri.address}&chain_type=${uri.chainType}`;
    case UriActionType.SendTokens:
      if (uri.amount) {
        return `${DPM_URI_PROTOCOL}//${UriActionType.SendTokens}?address=${uri.address}&chain_type=${uri.chainType}&amount=${uri.amount.amount}${uri.amount.denom}`;
      }
      return `${DPM_URI_PROTOCOL}//${UriActionType.SendTokens}?address=${uri.address}&chain_type=${uri.chainType}`;

    default:
      // @ts-ignore
      throw new Error(`unsupported uri type: ${uri.type}`);
  }
};
