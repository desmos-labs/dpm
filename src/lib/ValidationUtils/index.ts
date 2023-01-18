import { EnglishMnemonic } from '@cosmjs/crypto';
import { fromBech32 } from '@cosmjs/encoding';

/**
 * Validate a given mnemonic.
 * @param mnemonic - The mnemonic to be checked.
 */
export const validateMnemonic = (mnemonic: string): boolean => {
  try {
    const check = new EnglishMnemonic(mnemonic);
    return !!check;
  } catch {
    return false;
  }
};

/**
 * Checks if the provided address is a valid desmos bech32 address.
 * @param address - The address to check.
 */
export default function validateDesmosAddress(address: string): boolean {
  try {
    const decoded = fromBech32(address);
    return decoded.prefix === 'desmos';
  } catch (e) {
    return false;
  }
}
