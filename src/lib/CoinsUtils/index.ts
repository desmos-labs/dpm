import { Coin } from '@desmoslabs/desmjs';
import { safeParseFloat } from 'lib/FormatUtils';
import { coin } from '@cosmjs/amino';

/**
 * Function to all the coins of an array or to sum two array of coins.
 * @param coinsA - First array to sum.
 * @param coinsB - Second array to sum.
 */
export const sumCoins = (coinsA: Coin[] | undefined, coinsB?: Coin[] | undefined): Coin[] => {
  const denomsAmounts: Record<string, number> = {};

  const performSum = (c: Coin) => {
    const currentValue = denomsAmounts[c.denom] ?? 0;
    denomsAmounts[c.denom] = currentValue + safeParseFloat(c.amount, 'en-US');
  };

  coinsA?.forEach(performSum);
  coinsB?.forEach(performSum);

  return Object.keys(denomsAmounts).map((k) => coin(denomsAmounts[k], k));
};
