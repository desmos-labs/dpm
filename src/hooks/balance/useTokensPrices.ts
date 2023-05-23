import { Coin } from '@cosmjs/stargate';
import { convertGraphQLTokenPrice } from 'lib/GraphQLUtils/prices';
import { findCurrencyByMinDenom } from 'lib/ChainsUtils';
import { safeParseFloat } from 'lib/FormatUtils';
import { useQuery } from '@apollo/client';
import GetTokensPrices from 'services/graphql/queries/GetTokensPrices';
import React from 'react';
import { DesmosMainnet } from '@desmoslabs/desmjs';
import { CoinFiatValue } from 'types/prices';

/**
 * Get the prices of a given list of coins from the GraphQL data.
 * @param data The GraphQL data.
 * @param coins The coin to get the price for.
 */
const getPrices = (data: any, coins: Coin[]) => {
  const prices = convertGraphQLTokenPrice(data);
  return coins.map<CoinFiatValue>((coin) => {
    const currency = findCurrencyByMinDenom(coin.denom);

    // Can't find a currency for this denom, we can't get the price of the
    // coin.
    if (currency === undefined) {
      return {
        denom: coin.denom,
        amount: coin.amount,
        fiatValue: 0,
      };
    }

    // Compare the denoms in a case-insensitive way because the currency.coinDenom
    // can be all upper case or PascalCase while the TokenPrice received
    // from the server is all lowercase.
    const currencyPrice = prices.find((p) => p.denom === currency.coinDenom.toLowerCase());

    // Can't find the price for this currency fallback to 0
    if (currencyPrice === undefined) {
      return {
        denom: coin.denom,
        amount: coin.amount,
        fiatValue: 0,
      };
    }

    // Factor to convert the coin from its minimal denom to the currency denom.
    const coinConversionFactory = 10 ** currency.coinDecimals;

    // Convert the coin amount.
    const coinAmount = safeParseFloat(coin.amount) / coinConversionFactory;

    return {
      denom: coin.denom,
      amount: coin.amount,
      fiatValue: coinAmount * currencyPrice.price,
    };
  });
};

/**
 * Hook that allows to get the price of a given token.
 * @param coins The coins to get the price for.
 */
const useTokensPrices = (coins: Coin[]) => {
  const { data, refetch, loading } = useQuery(GetTokensPrices, {
    variables: {
      denoms: DesmosMainnet.currencies.map((currency) => currency.coinMinimalDenom),
    },
  });

  const prices = React.useMemo(() => getPrices(data, coins), [data, coins]);

  return {
    prices,
    loading,
    refetch,
  };
};

export default useTokensPrices;
