import { NativeModules } from 'react-native';

const { Aes } = NativeModules;

export interface EncryptedData {
  iv: string;
  cipher: string;
}

/**
 * Derive a safe password using the pbkdf2 algorithm.
 * @param password The password from which will be derived the safer password.
 */
export const deriveSecurePassword = async (password: string): Promise<string> =>
  Aes.pbkdf2(password, password.normalize('NFKC'), 100000, 256);

/**
 * Encrypts the provided text using the AES algorithm.
 * @param text The text to encrypt.
 * @param password The password used to generate the cipher key.
 */
export const encryptData = async (text: string, password: string): Promise<EncryptedData> => {
  const securePassword: string = await deriveSecurePassword(password);
  const iv: string = await Aes.randomKey(16);
  return Aes.encrypt(text, securePassword, iv, 'aes-256-cbc').then((cipher: string) => ({
    cipher,
    iv,
  }));
};

/**
 * Decrypts data with the provided password.
 * @param data The data to be decrypted.
 * @param password The password used to generate the cipher key.
 */
export const decryptData = async (data: EncryptedData, password: string): Promise<string> => {
  const securePassword: string = await deriveSecurePassword(password);
  return Aes.decrypt(data.cipher, securePassword, data.iv, 'aes-256-cbc');
};
