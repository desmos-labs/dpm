import RNFS from "react-native-fs"
import {DesmosProfile} from "@desmoslabs/sdk-core";
import {CachedDesmosProfile} from "../types/chain";

/**
 * Checks if the provided uri is a remote http/https resource.
 * @param uri - The uri of interest.
 * @returns true if the provided uri is referencing a remote http/https resource.
 */
function isRemoteUrl(uri?: string): boolean {
    if (uri === undefined) {
        return false;
    }

    return uri.indexOf("http://") === 0 || uri.indexOf("https://") === 0;
}

/**
 * Gets the file extension from it's uri.
 * The extensions is resolved finding the last "." symbol and
 * returning all the text after that.
 * @param fileUri - The uri from where will be extracted the file extension.
 * @returns the parsed extension or undefined if the extension can not be parsed.
 */
function getFileExtension(fileUri: string): string | undefined {
    const extensionBegin = fileUri.lastIndexOf(".");
    if (extensionBegin === -1 || extensionBegin === fileUri.length) {
        return undefined;
    }
    return fileUri.slice(extensionBegin + 1);
}

export interface RemoteResourceOverride {
    readonly profilePicture?: string,
    readonly coverPicture?: string,
}

/**
 * Class that stores the desmos profiles
 * on the device memory cashing the remote resource like
 * profile picture and the cover picture.
 * The files are organized in this way:
 * * Root `profiles` directory
 *      * a directory for each profile with name = profile bech32 address
 *          * profile.json - contains the profile fetched from the chain
 *          * profile-picture - contains the downloaded profile picture
 *          * cover-picture - contains the downloaded cover picture
 *      * profiles.json - contain a JSON array of all the saved profiles addresses.
 */
export class ProfileSource {

    private readonly ProfilesDirectoryPath = `${RNFS.DocumentDirectoryPath}/profiles`;

    /**
     * Gets the root directory path where should be stored all profiles files.
     * @private
     */
    private async getRootDirectoryPath(): Promise<string> {
        if (!(await RNFS.exists(this.ProfilesDirectoryPath))) {
            await RNFS.mkdir(this.ProfilesDirectoryPath);
        }
        return this.ProfilesDirectoryPath
    }

    /**
     * Gets the file path where are stored all the saved profiles addresses.
     * @private
     */
    private async addressesFile(): Promise<string> {
        const rootDir = await this.getRootDirectoryPath();
        return `${rootDir}/profiles.json`;
    }

    /**
     * Gets the directory path where are stored all files belonging to the
     * profile with the provided address.
     * @private
     */
    private async profileFilesDirectoryPath(address: string): Promise<string> {
        const rootDir = await this.getRootDirectoryPath();
        const profileFileDir = `${rootDir}/${address}`;
        if (!(await RNFS.exists(profileFileDir))) {
            await RNFS.mkdir(profileFileDir);
        }
        return profileFileDir;
    }

    /**
     * Gets the file path of the json file that contains the serialized profile
     * with the provided address.
     * @private
     */
    private async profileFile(address: string): Promise<string> {
        const cachePath = await this.profileFilesDirectoryPath(address);
        return `${cachePath}/profile.json`;
    }

    /**
     * Gets the file path of the profile picture associated to the
     * profile with the provided address.
     * @private
     */
    private async profilePictureFile(address: string, extension: string): Promise<string> {
        const cachePath = await this.profileFilesDirectoryPath(address);
        return `${cachePath}/profile-picture.${extension}`;
    }

    /**
     * Gets the file path of the cover picture associated to the
     * profile with the provided address.
     * @private
     */
    private async coverPictureFile(address: string, extension: string): Promise<string> {
        const cachePath = await this.profileFilesDirectoryPath(address);
        return `${cachePath}/cover-picture.${extension}`;
    }

    /**
     * Gets a list of all the addresses of the stored profiles.
     * @private
     */
    private async getStoredProfilesAddress(): Promise<string[]> {
        try {
            const addressesFilePath = await this.addressesFile();
            return JSON.parse(await RNFS.readFile(addressesFilePath));
        } catch (e) {
            return []
        }
    }

    /**
     * Saves the list of all the profiles addresses.
     * @param addresses - The list of addresses to store.
     * @private
     */
    private async saveStoredProfilesAddress(addresses: string[]): Promise<void> {
        const file = await this.addressesFile();
        try {
            if (await RNFS.exists(file)) {
                await RNFS.unlink(file);
            }
            await RNFS.writeFile(file, JSON.stringify(addresses));
        } catch (e) {
            console.error("Error while saving the profiles addresses", e);
        }
    }

    /**
     * Adds an address to the list of all the profiles addresses and
     * save it to the disk.
     * If the address is already present will not be added.
     * @param addresses - The address to add.
     * @private
     */
    private async addSavedProfilesAddress(addresses: string): Promise<void> {
        const profiles = await this.getStoredProfilesAddress();
        const foundIndex = profiles.indexOf(addresses);
        if (foundIndex === -1) {
            profiles.push(addresses);
            await this.saveStoredProfilesAddress(profiles);
        }
    }

    /**
     * Removes an address from the list of all the profiles address.
     * @param addresses - The address to remove.
     * @private
     */
    private async removeSavedProfilesAddress(addresses: string): Promise<void> {
        const profiles = await this.getStoredProfilesAddress();
        const foundIndex = profiles.indexOf(addresses);
        if (foundIndex !== -1) {
            profiles.splice(foundIndex, 1);
            await this.saveStoredProfilesAddress(profiles);
        }
    }

    /**
     * Gets all the profiles.
     * @returns a promise that resolves to a list of all the profile
     * saved inside the source.
     */
    async getAllProfiles(): Promise<CachedDesmosProfile[]> {
        const addresses = await this.getStoredProfilesAddress();
        const result: CachedDesmosProfile [] = []

        for (let i = 0; i < addresses.length; i++) {
            const profile = await this.getProfile(addresses[i]);
            if (profile === null) {
                await this.removeSavedProfilesAddress(addresses[i]);
            } else {
                result.push(profile);
            }
        }

        return result
    }

    /**
     * Gets a profile with the requested address.
     * @param address - Address of the profile of interest.
     * @returns a promise that resolves to the profile with the provided address
     * or null if the profile is not present.
     */
    async getProfile(address: string): Promise<CachedDesmosProfile | null> {
        const profileJson = await this.profileFile(address);
        const exist = await RNFS.exists(profileJson);
        if (!exist) {
            return null;
        }

        try {
            return JSON.parse(await RNFS.readFile(profileJson));
        } catch (e) {
            console.error("Error while reading cached profile", e);
            return null;
        }
    }

    /**
     * Saves a profile downloading all the remote resource so that can be available offline.
     * @param profile - The profile to add.
     * @param remoteResourceOverride - Optional configuration to tell the source
     * to copy a local file instead of downloading a remote file.
     * @returns a promise that resolves to a tuple where the first value is the saved
     * profile and the second value is boolean flag that tells if the profile
     * is different from the one previously cached.
     */
    async saveProfile(profile: DesmosProfile, remoteResourceOverride?: RemoteResourceOverride): Promise<[CachedDesmosProfile, boolean]> {
        let storedProfile = await this.getProfile(profile.address);
        let newProfile: CachedDesmosProfile = {...profile};

        let changed = storedProfile === null;
        const wasPresent = storedProfile !== null;

        if (isRemoteUrl(profile.profilePicture) &&
            profile.profilePicture !== storedProfile?.profilePicture) {
            const extension = getFileExtension(profile.profilePicture!);
            if (extension !== undefined) {
                const destFile = await this.profilePictureFile(profile.address, extension);
                if (remoteResourceOverride?.profilePicture !== undefined) {
                    await RNFS.copyFile(remoteResourceOverride.profilePicture, destFile);
                } else {
                    await RNFS.downloadFile({
                        fromUrl: profile.profilePicture!,
                        toFile: destFile,
                        cacheable: false
                    });
                }
                await RNFS.stat(destFile);
                newProfile.cachedProfilePictureUri = `file://${destFile}`;
                changed = true;
            }
        }

        if (isRemoteUrl(profile.coverPicture) &&
            profile.coverPicture !== storedProfile?.coverPicture) {
            const extension = getFileExtension(profile.coverPicture!);
            if (extension !== undefined) {
                const destFile = await this.coverPictureFile(profile.address, extension);
                if (remoteResourceOverride?.coverPicture !== undefined) {
                    await RNFS.copyFile(remoteResourceOverride.coverPicture, destFile);
                } else {
                    await RNFS.downloadFile({fromUrl: profile.coverPicture!, toFile: destFile});
                }
                await RNFS.stat(destFile);
                newProfile.cachedCoverPictureUri = `file://${destFile}`;
                changed = true;
            }
        }

        changed = changed || profile.dtag !== storedProfile?.dtag ||
            profile.nickname !== storedProfile?.nickname ||
            profile.bio !== storedProfile?.bio;

        if (changed) {
            const file = await this.profileFile(profile.address);
            if (await RNFS.exists(file)) {
                await RNFS.unlink(file);
            }
            await RNFS.writeFile(file, JSON.stringify(newProfile));
        }

        if (!wasPresent) {
            await this.addSavedProfilesAddress(profile.address);
        }

        return [newProfile, changed];
    }

    /**
     * Removes a profile from the source.
     * @param address - Address of the profile to delete.
     */
    async deleteProfile(address: string) {
        const profile = await this.getProfile(address);

        if (profile !== null) {
            const profileDir = await this.profileFilesDirectoryPath(address);
            const profileFile = await this.profileFile(address);
            // Delete the json file
            await RNFS.unlink(profileFile).catch(console.error);
            // Delete the cached cover picture
            if (profile.coverPicture) {
                await RNFS.unlink(profile.coverPicture).catch(console.error);
            }
            // Delete the cached profile picture
            if (profile.profilePicture) {
                await RNFS.unlink(profile.profilePicture).catch(console.error);
            }
            // Delete the profile dir
            await RNFS.unlink(profileDir).catch(console.error);
            await this.removeSavedProfilesAddress(profile.address);
        }
    }

}

// Singleton instance that can be accessed from the application.
const ProfileSourceSingleton = new ProfileSource();
export default ProfileSourceSingleton as ProfileSource;
