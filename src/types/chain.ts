import {DesmosProfile} from "@desmoslabs/sdk-core";

export enum ChainAccountType {
    Local,
}

export interface ChainAccount {
    type: ChainAccountType;
    name: string;
    address: string;
}

/**
 * Interface that represents a desmos profile with the
 * profile picture and cover picture cached inside the device storage.
 */
export interface CachedDesmosProfile extends DesmosProfile {
    /**
     * Uri that points to the cached profile picture.
     */
    cachedProfilePictureUri?: string,
    /**
     * Uri that points to the cached cover picture.
     */
    cachedCoverPictureUri?: string,
}