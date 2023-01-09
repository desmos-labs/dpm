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

export const defaultDesmosProfile = (address: string): DesmosProfile =>
  ({
    address,
  } as DesmosProfile);
