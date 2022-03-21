import { Bech32 } from '@cosmjs/encoding';

/**
 * Checks if the provided address is a valid desmos bech32 address.
 * @param address - The address to check.
 */
export function checkDesmosAddress(address: string): boolean {
	try {
		const decoded = Bech32.decode(address);
		return decoded.prefix === 'desmos';
	} catch (e) {
		return false;
	}
}
