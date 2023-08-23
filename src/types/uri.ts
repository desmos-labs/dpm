/**
 * Enum that defines the uris that the application supports.
 */
export enum UriActionType {
  /**
   * Uri that contains the address of a user.
   */
  UserAddress = 'address',
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

export type UriAction = UserAddressActionUri;
