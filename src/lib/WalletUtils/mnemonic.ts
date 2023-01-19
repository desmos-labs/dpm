import * as bip39 from 'bip39';

export function randomMnemonic(wordCount: 12 | 24 = 24): string {
  if (wordCount !== 12 && wordCount !== 24) {
    throw new Error('can generate mnemonic only with length 24 or 12');
  }

  const strength = wordCount === 24 ? 256 : 128;
  return bip39.generateMnemonic(strength);
}

export function checkMnemonic(mnemonic: string): boolean {
  return bip39.validateMnemonic(mnemonic);
}
