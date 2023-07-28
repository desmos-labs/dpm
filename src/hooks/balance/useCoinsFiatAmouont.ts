import { Coin } from '@cosmjs/stargate';
import useTokensPrices from 'hooks/balance/useTokensPrices';
import React from 'react';
import { roundFloat } from 'lib/FormatUtils';
import { CoinFiatValue } from 'types/prices';

/**
 * Calculates the fiat amount based on the provided prices.
 * @param prices - The prices to be used for the calculation.
 */
const computeAmount = (prices: CoinFiatValue[]) => {
  const value = prices.map((p) => p.fiatValue).reduce((a, b) => a + b, 0);
  return roundFloat(value, 4);
};

/**
 * Hook that allows to get the fiat amount for a given balance.
 * @param balance - The balance to get the fiat amount for.
 * @param lazy - Tells if the data should be lazy fetched.
 */
const useBalanceFiatAmount = (balance: Coin[], lazy?: boolean) => {
  const { prices, loading, refetch: refetchData } = useTokensPrices(balance, lazy);

  const refetch = React.useCallback(
    async (providedCoins?: Coin[]) => {
      const result = await refetchData(providedCoins);
      return {
        ...result,
        data: computeAmount(result.data),
      };
    },
    [refetchData],
  );

  const amount = React.useMemo(() => computeAmount(prices), [prices]);

  return {
    // Currently the APIs allow to get only the price in USD.
    symbol: '$',
    amount,
    loading,
    refetch,
  };
};

export default useBalanceFiatAmount;
