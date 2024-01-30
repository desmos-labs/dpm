import { ChainType } from 'types/chains';
import { Coin } from '@desmoslabs/desmjs';

/**
 * Enum that defines the uris that the application supports.
 */
export enum UriActionType {
  /**
   * Uri that contains the address of a user.
   * @deprecated This has been replaced by: {@link UriActionType.ViewProfile}.
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
  /**
   * Type representing a URI action that tells the application
   * to create a new wallet connect session.
   */
  WalletConnectPair = 'walletconnect_pair',
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
  readonly chainType: ChainType;
}

/**
 * Type that defines the actions that can be pefromed when we receive a
 * {@link GenericActionUri}.
 */
export type GenericActionsTypes = UriActionType.SendTokens | UriActionType.ViewProfile;

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

/**
 * Interface representing a URI action that tells the application
 * to create a new wallet connect session.
 */
export interface WalletConnectPairActionUri {
  readonly type: UriActionType.WalletConnectPair;
  /**
   * The wallet connect URI to be used.
   */
  readonly uri: string;
  /**
   * Indicates whether the application should return to the app that has
   * triggered the pairing request after the user has accepted the pairing request.
   */
  readonly returnToApp?: boolean;
}

export type UriAction =
  | UserAddressActionUri
  | GenericActionUri
  | ViewProfileActionUri
  | SendTokensActionUri
  | WalletConnectPairActionUri;
