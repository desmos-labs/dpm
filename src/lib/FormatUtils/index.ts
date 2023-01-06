import { Coin } from '@desmoslabs/desmjs-types/cosmos/base/v1beta1/coin';
import { convertCoin, Currency } from '@desmoslabs/desmjs';
import { Slip10RawIndex } from '@cosmjs/crypto';
import SupportedChains from 'config/LinkableChains';
import numbro from 'numbro';

/**
 * Gets the decimal separator used on the provided locale.
 * @param locale - The locale to us, if empty use the current one.
 */
export const getDecimalSeparator = (locale?: string) => {
  // Get the thousands and decimal separator characters used in the locale.
  const [, separator] = (1.1).toLocaleString(locale);
  return separator;
};

/**
 * Parse a number using the current locale or the provided one.
 * @param value - Value to be parsed
 * @param locale - The locale to us, if empty use the current one.
 */
export const safePartFloat = (value: string | undefined, locale?: string) => {
  const separator = getDecimalSeparator(locale);

  // Remove thousands separators, and put a point where the decimal separator occurs
  const string = Array.from(value || '0', (c) => (c === separator ? '.' : c)).join('');
  const parsed = parseFloat(string);
  return Number.isNaN(parsed) ? 0 : parsed;
};

/**
 * Safely parse the given value as an integer, returning 0 if malformed.
 * @param value - Value to be parsed.
 */
export const safeParseInt = (value: string): number => {
  const number = parseInt(value, 10);
  if (Number.isNaN(number)) {
    return 0;
  }
  return number;
};

const getChainCurrencies = (): Currency[] =>
  SupportedChains.flatMap((chain) => chain.chainInfo || []).flatMap((info) => info.currencies);

/**
 * Formats the given value into a human-readable string.
 * @param value - Value to be formatted
 */
export const formatNumber = (value: number): string => {
  console.log(value);
  return numbro(value).format({
    thousandSeparated: true,
  });
};

/**
 * Formats the given amount into a human-readable value.
 * @param amount - Coin that should be formatted.
 */
export const formatCoin = (amount: Coin): string => {
  const currencies = getChainCurrencies();
  const convertedAmount = convertCoin(amount, 6, currencies) || amount;
  return `${convertedAmount.amount} ${convertedAmount.denom.toUpperCase()}`;
};

/**
 * Formats the given coins and returns a string representing the overall amount.
 * @param amount - Amount to be formatted.
 */
export const formatCoins = (amount: Coin[] | undefined): string =>
  (amount || []).map(formatCoin).join('\n');

/**
 * Perform the sanitization to a seed phrase.
 * @param mnemonic - The seed phrase to sanitize.
 */
export const sanitizeMnemonic = (mnemonic: string): string => mnemonic.replace(/\n\n/g, ' ').trim();

/**
 * Converts a [Slip10RawIndex] to it's base number representation.
 * @param index - The index to convert.
 */
export const slip10IndexToBaseNumber = (index: Slip10RawIndex): number =>
  index.isHardened() ? index.toNumber() - 2 ** 31 : index.toNumber();

/**
 * Converts a [Slip10RawIndex] to it string representation.
 * @param index - The index to convert to string.
 */
export const slip10IndexToString = (index: Slip10RawIndex): string =>
  slip10IndexToBaseNumber(index).toString();

/**
 * Hides the given value, using * in order to cover each character.
 * @param value - Value to be hidden.
 */
export const formatHiddenValue = (value: string): string => {
  let toReturn = '';
  for (let index = 0; index < value.length; index += 1) {
    toReturn += '*';
  }
  return toReturn;
};
