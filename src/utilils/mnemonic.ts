/**
 * Perform some sanifications to a seed phrase.
 * @param mnemonic - The seed phrase to sanitize.
 * @param options - Object that contains the sanifications config.
 */
export default function sanitizeMnemonic(
  mnemonic: string,
  options: {
    removeStartingSpaces?: boolean;
    removeDoubleSpaces?: boolean;
    removeTrailingSpaces?: boolean;
  }
): string {
  let sanitizedMnemonic = mnemonic;

  // Remove initial spaces
  if (options.removeStartingSpaces === true) {
    while (sanitizedMnemonic.indexOf(' ') === 0) {
      sanitizedMnemonic = sanitizedMnemonic.slice(1);
    }
  }

  // Replace double spaces with single space
  if (options.removeDoubleSpaces === true) {
    sanitizedMnemonic = sanitizedMnemonic.replace(/ +/gm, ' ');
  }

  // Remove end spaces
  if (options.removeTrailingSpaces === true) {
    while (sanitizedMnemonic.lastIndexOf(' ') === sanitizedMnemonic.length - 1) {
      sanitizedMnemonic = sanitizedMnemonic.slice(0, sanitizedMnemonic.length - 1);
    }
  }

  return sanitizedMnemonic;
}
