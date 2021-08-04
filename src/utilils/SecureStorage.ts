import SInfo, {RNSensitiveInfoOptions} from "react-native-sensitive-info";
import { NativeModules } from 'react-native'

const Aes = NativeModules.Aes
const DPM_SHARED_PREFERENCES = "dmpPreferences"
const DPM_SERVICE = "dmpKeychainService"

const SInfoOptions: RNSensitiveInfoOptions = {
    sharedPreferencesName: DPM_SHARED_PREFERENCES,
    keychainService: DPM_SERVICE,
}

const SInfoBiometricOptions: RNSensitiveInfoOptions = {
    ...SInfoOptions,
    touchID: true,
    showModal: true,
    kSecUseOperationPrompt: 'We need your permission to retrieve encrypted data',
    kSecAccessControl: 'kSecAccessControlBiometryAny' // Add support for FaceID
}

interface EncryptedData {
    iv: string,
    cipher: string
}

/**
 * Options used to configure how the data will be stored into the device.
 */
export interface StoreOptions {
    /**
     * The password used to cipher the data.
     */
    password?: string
    /**
     * Tells if the data should be linked to the user's biometric informations.
     */
    biometrics?: boolean
}

/**
 * Derive a safe password using the pbkdf2 algorithm.
 * @param password The password from which will be derived the safer password.
 */
async function deriveSecurePassword(password: string): Promise<string> {
    return Aes.pbkdf2(password, "salt_dpm", 100000, 256);
}

/**
 * Encrypts the provided text using the AES algorithm.
 * @param text The text to encrypt.
 * @param password The password used to generate the cipher key.
 */
async function encryptData (text: string, password: string): Promise<EncryptedData> {
    const securePassword: string = await deriveSecurePassword(password);
    const iv: string = await Aes.randomKey(16);
    return Aes.encrypt(text, securePassword, iv).then((cipher: string) => ({
        cipher,
        iv
    }));
}

/**
 * Decrypts data with the provided password.
 * @param data The data to be decrypted.
 * @param password The password used to generate the cipher key.
 */
async function decryptData(data: EncryptedData, password: string): Promise<string> {
    const securePassword: string = await deriveSecurePassword(password);
    return Aes.decrypt(data.cipher, securePassword, data.iv);
}

/**
 * Gets an item from the storage.
 * @param key Item key.
 * @param options Options to describe how the data are stored into the device storage.
 */
export async function getItem(key: string, options: StoreOptions | undefined = undefined): Promise<string> {
    const sIfoOptions = options?.biometrics === true ? SInfoBiometricOptions : SInfoOptions;
    const value = await SInfo.getItem(key, sIfoOptions);

    if (options?.password !== undefined) {
        const jsonValue = JSON.parse(value);
        if (typeof jsonValue.iv !== "string" && typeof jsonValue.cipher !== "string") {
            throw new Error("Invalid encrypted data");
        }
        else {
            return decryptData(jsonValue as EncryptedData, options.password)
        }
    }

    return value;
}

/**
 * Inserts/Updates an item into the storage.
 * @param key Item key.
 * @param value Value to insert into the storage.
 * @param options Options to describe how the data will be stored into the device storage.
 */
export async function setItem(key: string, value: string, options: StoreOptions | undefined = undefined): Promise<null> {
    const sIfoOptions = options?.biometrics === true ? SInfoBiometricOptions : SInfoOptions;

    if (options?.password !== undefined) {
        const encryptedData = await encryptData(value, options.password);
        return SInfo.setItem(key, JSON.stringify(encryptedData), sIfoOptions);
    }

    return SInfo.setItem(key, value, sIfoOptions);
}