import { Coin } from '@desmoslabs/desmjs';
import { safeParseFloat } from 'lib/FormatUtils';
import { coin } from '@cosmjs/amino';

/**
 * Sum two array of Coin by their denom.
 * @param coinsA - First array to sum.
 * @param coinsB - Second array to sum.
 */
export const sumCoins = (coinsA: Coin[] | undefined, coinsB?: Coin[] | undefined): Coin[] => {
  const denomsAmounts: Record<string, number> = {};

  coinsA?.forEach((c) => {
    const currentValue = denomsAmounts[c.denom] ?? 0;
    denomsAmounts[c.denom] = currentValue + safeParseFloat(c.amount);
  });

  coinsB?.forEach((c) => {
    const currentValue = denomsAmounts[c.denom] ?? 0;
    denomsAmounts[c.denom] = currentValue + safeParseFloat(c.amount);
  });

  return Object.keys(denomsAmounts).map((k) => coin(denomsAmounts[k], k));
};
