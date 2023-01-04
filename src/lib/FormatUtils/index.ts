import { Coin } from '@desmoslabs/desmjs-types/cosmos/base/v1beta1/coin';
import { ChainInfo, convertCoin } from '@desmoslabs/desmjs';
import { Slip10RawIndex } from '@cosmjs/crypto';

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

/**
 * Formats the given coins and returns a string representing the overall amount.
 * @param chainInfo - Info of the chain that should be used to format the coins.
 * @param amount - Amount to be formatted.
 */
export const formatCoins = (chainInfo: ChainInfo, amount: Coin[] | undefined): string => {
  if (!amount) {
    return '';
  }
  return amount
    .map((coinAmount) => {
      const converted = convertCoin(coinAmount, 6, chainInfo.currencies);
      if (converted !== null) {
        return `${converted.amount} ${converted.denom.toUpperCase()}`;
      }
      return `${coinAmount.amount} ${coinAmount.denom}`;
    })
    .join('\n');
};

/**
 * Perform the sanitization to a seed phrase.
 * @param mnemonic - The seed phrase to sanitize.
 */
export const sanitizeMnemonic = (mnemonic: string): string => {
  return mnemonic.replace(/\n\n/g, ' ').trim();
};

/**
 * Converts a [Slip10RawIndex] to it's base number representation.
 * @param index - The index to convert.
 */
export const slip10IndexToBaseNumber = (index: Slip10RawIndex): number => {
  return index.isHardened() ? index.toNumber() - 2 ** 31 : index.toNumber();
};

/**
 * Converts a [Slip10RawIndex] to it string representation.
 * @param index - The index to convert to string.
 */
export const slip10IndexToString = (index: Slip10RawIndex): string => {
  return slip10IndexToBaseNumber(index).toString();
};
