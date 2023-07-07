import { Coin } from '@desmoslabs/desmjs-types/cosmos/base/v1beta1/coin';
import { convertCoin, Currency } from '@desmoslabs/desmjs';
import { Slip10RawIndex } from '@cosmjs/crypto';
import SupportedChains from 'config/LinkableChains';
import numbro from 'numbro';
import { Input } from 'cosmjs-types/cosmos/bank/v1beta1/bank';
import Long from 'long';
import { format } from 'date-fns';
import { MarkdownIt, stringToTokens } from 'react-native-markdown-display';

/**
 * Gets the decimal separator used on the provided locale.
 * @param locale - The locale to us, if empty use the current one.
 */
export const getDecimalSeparator = (locale?: string) => {
  // Get the decimal separator characters used in the locale.
  const [, separator] = (1.1).toLocaleString(locale);
  return separator;
};

/**
 * Gets the thousands separator used on the provided locale.
 * @param locale - The locale to us, if empty use the current one.
 */
export const getThousandsSeparator = (locale?: string) => {
  // Get the thousands separator characters used in the locale.
  const [, separator] = (1000).toLocaleString(locale);
  return separator;
};

/**
 * Parse a number using the current locale or the provided one.
 * @param value - Value to be parsed
 * @param locale - The locale to us, if empty use the current one.
 */
export const safeParseFloat = (value: string | undefined, locale?: string) => {
  const decimalSeparator = getDecimalSeparator(locale);
  const thousandsSeparator = getThousandsSeparator(locale);

  // Remove thousands separators, and put a point where the decimal separator occurs
  const string = Array.from(value || '0', (c) => {
    if (c === thousandsSeparator) {
      return '';
    }
    if (c === decimalSeparator) {
      return '.';
    }
    return c;
  }).join('');
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
export const formatNumber = (value: number): string =>
  numbro(value).format({
    thousandSeparated: true,
  });

/**
 * Formats the given amount into a human-readable value.
 * @param amount - Coin that should be formatted.
 */
export const formatCoin = (amount: Coin): string => {
  const currencies = getChainCurrencies();
  const convertedAmount = convertCoin(amount, 6, currencies) || amount;
  const humanReadableAmount = formatNumber(safeParseFloat(convertedAmount.amount, 'en-US'));
  return `${humanReadableAmount} ${convertedAmount.denom.toUpperCase()}`;
};

/**
 * Formats the given coins and returns a string representing the overall amount.
 * @param amount - Amount to be formatted.
 * @param separator - Optional separator to be used.
 */
export const formatCoins = (
  amount: readonly Coin[] | undefined,
  separator: string = '\n',
): string => (amount || []).map(formatCoin).join(separator);

/**
 * Formats the given inputs and returns a string representing the overall amount
 * @param inputs - Amount to be formatted.
 * @param separator - Optional separator to be used when separating each input's value.
 */
export const formatMultiSendInput = (inputs: Input[], separator: string = '\n'): string =>
  inputs.map((input) => formatCoins(input.coins, separator)).join('\n');

/**
 * Perform the sanitization to a seed phrase.
 * @param mnemonic - The seed phrase to sanitize.
 * @param skipTrimEnd - Tells if shouldn't be removed the whitespace chars from the
 * end of the string.
 */
export const sanitizeMnemonic = (mnemonic: string, skipTrimEnd?: boolean): string => {
  // Replace the double spaces with a single space and
  // remove all the characters that are not a-z or space.
  const sanitized = mnemonic.replace(/( {2,})/gm, ' ').replace(/[^a-z ]/gm, '');
  if (skipTrimEnd === true) {
    return sanitized;
  }
  return sanitized.trimEnd();
};

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

/**
 * Capitalize the provided string.
 * @param value - The string to capitalize.
 */
export const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

/**
 * Round a float number to have only the specified number of decimals digits.
 * @param value - Number that needs to be rounded to a certain number of decimal places.
 * @param decimals - The number of decimal places to which the value needs to be rounded.
 */
export const roundFloat = (value: number, decimals: number): number => {
  const roundFactor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * roundFactor) / roundFactor;
};

/**
 * Checks if the provided string is a valid number.
 * Note: This function don't allow the presence of the thousand separator.
 * @param value - The value to check.
 */
export const isStringNumberValid = (value: string): boolean => {
  const testRe = new RegExp(`^[0-9]+${getDecimalSeparator()}?([0-9]+)?$`);
  return testRe.test(value);
};

/**
 * Format an IBC timeout timestamp into a huma readable date.
 * @param timestamp - The timestamp to format.
 */
export const formatIbcTimeoutTimestamp = (timestamp: Long | undefined) => {
  if (timestamp !== undefined) {
    return format(new Date(timestamp.toNumber()), 'dd MMM yyyy, HH:mm:ss');
  }
  return undefined;
};

/**
 * Function to convert a markdown text to its plain text representation.
 * @param markdownText - The markdown text to transform.
 */
export const makrdownToPlainText = (markdownText: string): string => {
  const withNewLines = markdownText.replace(/\\n/gm, '\n');
  const markdownItInstance = MarkdownIt({ typographer: true });
  return stringToTokens(withNewLines, markdownItInstance)
    .filter((t) => t.children !== null)
    .flatMap((t) => t.children)
    .filter((t) => (t.type === 'text' && t.content !== '') || t.type === 'softbreak')
    .reduce((previousValue, token) => {
      if (token.type === 'text') {
        return `${previousValue}${token.content} `;
      }
      return `${previousValue}\n`;
    }, '');
};
