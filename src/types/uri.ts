import { ChainType } from 'types/chains';
import { Coin } from '@desmoslabs/desmjs';

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
  /**
   * Type representing a URI action that tells the application
   * to display the profile of a user.
   */
  ViewProfile = 'view_profile',
  /**
   * Type representing a URI action that tells the application
   * to send some tokens to a user.
   */
  SendTokens = 'send_tokens',
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

/**
 * Interface representing a URI action that tells the application
 * to display the profile of a user.
 */
export interface ViewProfileActionUri {
  readonly type: UriActionType.ViewProfile;
  /**
   * The user's bech32 address.
   */
  readonly address: string;
  /**
   * The user's chain id.
   */
  readonly chainType: ChainType;
}

/**
 * Interface representing a URI action that tells the application
 * to send some tokens to a user.
 */
export interface SendTokensActionUri {
  readonly type: UriActionType.SendTokens;
  /**
   * The user's bech32 address.
   */
  readonly address: string;
  /**
   * The user's chain id.
   */
  readonly chainType: ChainType;
  /**
   * Optional amount to be sent.
   */
  readonly amount?: Coin;
}

export type UriAction =
  | UserAddressActionUri
  | GenericActionUri
  | ViewProfileActionUri
  | SendTokensActionUri;
