import RNFS from 'react-native-fs';
import { DesmosProfile } from '@desmoslabs/sdk-core';

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
		return this.ProfilesDirectoryPath;
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
	 * Gets a list of all the addresses of the stored profiles.
	 * @private
	 */
	private async getStoredProfilesAddress(): Promise<string[]> {
		try {
			const addressesFilePath = await this.addressesFile();
			return JSON.parse(await RNFS.readFile(addressesFilePath));
		} catch (e) {
			return [];
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
			console.error('Error while saving the profiles addresses', e);
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
	async getAllProfiles(): Promise<DesmosProfile[]> {
		const addresses = await this.getStoredProfilesAddress();
		const result: DesmosProfile[] = [];

		for (let i = 0; i < addresses.length; i++) {
			const profile = await this.getProfile(addresses[i]);
			if (profile === null) {
				await this.removeSavedProfilesAddress(addresses[i]);
			} else {
				result.push(profile);
			}
		}

		return result;
	}

	/**
	 * Gets a profile with the requested address.
	 * @param address - Address of the profile of interest.
	 * @returns a promise that resolves to the profile with the provided address
	 * or null if the profile is not present.
	 */
	async getProfile(address: string): Promise<DesmosProfile | null> {
		const profileJson = await this.profileFile(address);
		const exist = await RNFS.exists(profileJson);
		if (!exist) {
			return null;
		}

		try {
			return JSON.parse(await RNFS.readFile(profileJson));
		} catch (e) {
			console.error('Error while reading cached profile', e);
			return null;
		}
	}

	/**
	 * Saves a profile downloading all the remote resource so that can be available offline.
	 * @param profile - The profile to add.
	 * @returns a promise that resolves to a tuple where the first value is the saved
	 * profile and the second value is boolean flag that tells if the profile
	 * is different from the one previously cached.
	 */
	async saveProfile(profile: DesmosProfile): Promise<[DesmosProfile, boolean]> {
		let storedProfile = await this.getProfile(profile.address);
		let newProfile: DesmosProfile = {
			...profile,
		};

		let changed = storedProfile === null;
		const wasPresent = storedProfile !== null;

		changed =
			changed ||
			profile.dtag !== storedProfile?.dtag ||
			profile.profilePicture !== storedProfile?.profilePicture ||
			profile.coverPicture !== storedProfile?.coverPicture ||
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
			await RNFS.unlink(profileFile).catch((e) =>
				console.error('unlink profileFile', e)
			);
			// Delete the profile dir
			await RNFS.unlink(profileDir).catch((e) =>
				console.error('unlink profileDir', e)
			);
			await this.removeSavedProfilesAddress(profile.address);
		}
	}
}

// Singleton instance that can be accessed from the application.
const ProfileSourceSingleton = new ProfileSource();
export default ProfileSourceSingleton as ProfileSource;
