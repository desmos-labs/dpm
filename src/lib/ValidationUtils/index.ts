import { fromBech32 } from '@cosmjs/encoding';

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
