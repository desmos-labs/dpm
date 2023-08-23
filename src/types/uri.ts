import { ChainType } from 'types/chains';

/**
 * Enum that defines the uris that the application supports.
 */
export enum UriActionType {
  /**
   * Uri that contains the address of a user.
   */
  UserAddress = 'address',
  /**
   * Type representing a URI without context.
   * This URI should include the account's address in the
   * `address` query parameter and the chain ID in the
   * `chain_type` parameter.
   */
  Generic = '',
}

/**
 * Interface that represents an uri that contains the address of a user.
 */
export interface UserAddressActionUri {
  readonly type: UriActionType.UserAddress;
  /**
   * The user's address.
   */
  readonly address: string;
}

/**
 * Interface representing a generic URI action that includes the user's address
 * and its chain ID.
 * When the application receives this action, it should display a popup
 * allowing the user to make a decision on how to proceed.
 */
export interface GenericActionUri {
  readonly type: UriActionType.Generic;
  /**
   * The user's bech32 address.
   */
  readonly address: string;
  /**
   * The user's chain id.
   */
  readonly chainId: ChainType;
}

export type UriAction = UserAddressActionUri | GenericActionUri;
