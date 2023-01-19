import { ApplicationLinkState } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_app_links';

export interface NicknameParams {
  readonly minLength: number;
  readonly maxLength: number;
}

export interface DTagParams {
  readonly regEx: string;
  readonly minLength: number;
  readonly maxLength: number;
}

export interface BioParams {
  readonly maxLength: number;
}

export interface ProfileParams {
  readonly nickname: NicknameParams;
  readonly dTag: DTagParams;
  readonly bio: BioParams;
}

export interface DesmosProfile {
  /** The user's address */
  address: string;
  /** User DTag */
  dtag?: string;
  /** The user nickname */
  nickname?: string;
  /** The user bio */
  bio?: string;
  /** Url to the user profile picture */
  profilePicture?: string;
  /** Url to the user cover picture */
  coverPicture?: string;
}

export type ChainLink = {
  /**
   * Name of the linked chain like osmosis, cosmos.
   */
  chainName: string;
  /**
   * Desmos address of the user.
   */
  userAddress: string;
  /**
   * User address on the linked chain.
   */
  externalAddress: string;
  /**
   * Proof that was used to prove the ownership of the external account;
   */
  proof: ChainLinkProof;
  /**
   * Time when the chain link has been created.
   */
  creationTime: Date;
};

/**
 * Type that represents the information need to
 * prove the ownership of a different chain account.
 */
export type ChainLinkProof = {
  /**
   * Plain text that was signed to prove the ownership of the external account.
   */
  plainText: string;
  /**
   * Signature that was produced to prove the ownerhip of the external account.
   */
  signature: string;
};

export interface ApplicationLink {
  /**
   * Name of the application that has been connected.
   */
  readonly application: string;
  /**
   * Username of the connected account.
   */
  readonly username: string;
  /**
   * State of the application link.
   */
  readonly state: ApplicationLinkState;
  /**
   * Creation date of the application link.
   */
  readonly creationTime: Date;
}
