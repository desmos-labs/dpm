import { Coin } from '@cosmjs/stargate';
import useTokensPrices from 'hooks/balance/useTokensPrices';
import React from 'react';
import { roundFloat } from 'lib/FormatUtils';

/**
 * Hook that allows to get the fiat amount for a given balance.
 * @param balance The balance to get the fiat amount for.
 */
const useBalanceFiatAmount = (balance: Coin[]) => {
  const { prices, loading, refetch } = useTokensPrices(balance);

  const amount = React.useMemo(() => {
    const value = prices.map((p) => p.fiatValue).reduce((a, b) => a + b, 0);
    return roundFloat(value, 4);
  }, [prices]);

  return {
    // Currently the APIs allow to get only the price in USD.
    symbol: '$',

    amount,
    loading,
    refetch,
  };
};

export default useBalanceFiatAmount;
