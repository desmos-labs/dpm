/**
 * Enum that defines the uris that the application supports.
 */
export enum DPMUriType {
  /**
   * Uri that contains the address of a user.
   */
  UserAddress = 'address',
}

/**
 * Interface that represents an uri that contains the address of a user.
 */
export interface DPMUserAddressUri {
  readonly type: DPMUriType.UserAddress;
  /**
   * The user's address.
   */
  readonly address: string;
}

export type DPMUri = DPMUserAddressUri;
