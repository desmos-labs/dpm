import { Coin } from '@desmoslabs/desmjs-types/cosmos/base/v1beta1/coin';
import { convertCoin, Currency } from '@desmoslabs/desmjs';
import { Slip10RawIndex } from '@cosmjs/crypto';
import SupportedChains from 'config/LinkableChains';

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
 * Formats the given coins and returns a string representing the overall amount.
 * @param amount - Amount to be formatted.
 */
export const formatCoins = (amount: Coin[] | undefined): string => {
  const currencies = getChainCurrencies();
  return (amount || [])
    .map((coinAmount) => {
      const convertedAmount = convertCoin(coinAmount, 6, currencies) || coinAmount;
      return `${convertedAmount.amount} ${convertedAmount.denom.toUpperCase()}`;
    })
    .join('\n');
};

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
