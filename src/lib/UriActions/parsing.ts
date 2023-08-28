import { UriAction, UriActionType } from 'types/uri';
import { ChainType } from 'types/chains';
import { parseCoins } from '@cosmjs/amino';
import { Coin } from '@desmoslabs/desmjs';

const DPM_URI_PROTOCOL = 'dpm:';

type UriActionParser = (data: Record<string, any>) => UriAction | undefined;

const UriActionParsers: Record<string, UriActionParser> = {
  // GenericActionUri parser.
  [UriActionType.Generic]: (data) => {
    const { address, chain_type: chainType } = data;

    // Ensure that the provided chain id is "mainnet" or "testnet".
    if (!isChainTypeValid(chainType)) {
      return undefined;
    }

    // Ensure that the provided address is valid.
    if (!isAddressValid(address)) {
      return undefined;
    }

    return {
      type: UriActionType.Generic,
      address,
      chainType,
    };
  },
  // ViewProfileActionUri parser.
  [UriActionType.ViewProfile]: (data) => {
    const { address, chain_type: chainType } = data;

    // Ensure that the provided chain id is "mainnet" or "testnet".
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
  },
  // SendTokensActionUri parser.
  [UriActionType.SendTokens]: (data) => {
    const { address, chain_type: chainType, amount: rawAmount } = data;
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
  },
};

/**
 * Checks if the provided action is a valid instance of {@link UriActionType}.
 * @param action - The action to be validated.
 */
const isValidAction = (action: any): action is UriActionType =>
  typeof action === 'string' && Object.values(UriActionType).includes(action as UriActionType);

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
 * Function generate a {@link UriAction} from a given {@link Record}.
 * @param data - The data from which the action will be generated.
 */
export const actionUriFromRecord = (data: Record<string, any>): UriAction | undefined => {
  const action = data.action ?? UriActionType.Generic;

  if (!isValidAction(action)) {
    return undefined;
  }

  const parser = UriActionParsers[action];
  if (parser === undefined) {
    return undefined;
  }

  return parser(data);
};

/**
 * Function that given a {@link UriAction} generates its uri representation.
 * @param uri - Uri that will be converted to its string representation.
 * @deprecated This function should be removed after we have the api that
 * generates the uri.
 */
export const uriFromUriAction = (uri: UriAction): string => {
  switch (uri.type) {
    case UriActionType.UserAddress:
      return `${DPM_URI_PROTOCOL}//${UriActionType.UserAddress}/${uri.address}`;
    case UriActionType.Generic:
      return `${DPM_URI_PROTOCOL}//?address=${uri.address}&chain_type=${uri.chainType}`;
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
