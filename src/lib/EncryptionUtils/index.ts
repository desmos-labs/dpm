import Aes from 'react-native-aes-crypto';
import * as DeviceInfo from 'react-native-device-info';
import { Result, ResultAsync } from 'neverthrow';

export interface EncryptedData {
  iv: string;
  cipher: string;
}

/**
 * Derive a safe password using the pbkdf2 algorithm.
 * @param password The password from which will be derived the safer password.
 */
// ts-prune-ignore-next
export const deriveSecurePassword = async (password: string): Promise<string> => {
  const firstInstallTime = await DeviceInfo.getFirstInstallTime();
  return Aes.pbkdf2(password, firstInstallTime.toString(), 100_100, 256);
};

/**
 * Encrypts the provided text using the AES algorithm.
 * @param text The text to encrypt.
 * @param password The password used to generate the cipher key.
 */
export const encryptData = async (
  text: string,
  password: string,
): Promise<Result<EncryptedData, Error>> => {
  const securePassword: string = await deriveSecurePassword(password);

  // Generate a random IV
  const iv: string = await Aes.randomKey(16);

  // Encrypt the text
  return ResultAsync.fromPromise(
    Aes.encrypt(text, securePassword, iv, 'aes-256-cbc'),
    (e: any) => new Error(e.toString()),
  ).map((cipher) => ({
    cipher,
    iv,
  }));
};

/**
 * Decrypts data with the provided password.
 * @param data The data to be decrypted.
 * @param password The password used to generate the cipher key.
 */
export const decryptData = async (
  data: EncryptedData,
  password: string,
): Promise<Result<string, Error>> => {
  const securePassword: string = await deriveSecurePassword(password);
  return ResultAsync.fromPromise(
    Aes.decrypt(data.cipher, securePassword, data.iv, 'aes-256-cbc'),
    (e: any) => new Error(e.toString()),
  );
};
