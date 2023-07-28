import { Coin } from '@cosmjs/stargate';
import { convertGraphQLTokenPrice } from 'lib/GraphQLUtils/prices';
import { findCurrencyByMinDenom } from 'lib/ChainsUtils';
import { safeParseFloat } from 'lib/FormatUtils';
import { useQuery } from '@apollo/client';
import GetTokensPrices from 'services/graphql/queries/GetTokensPrices';
import React from 'react';
import { DesmosMainnet } from '@desmoslabs/desmjs';
import { CoinFiatValue, zeroCoinFiatValue } from 'types/prices';

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
      return zeroCoinFiatValue(coin.denom);
    }

    // Compare the denoms in a case-insensitive way because the currency.coinDenom
    // can be all upper case or PascalCase while the TokenPrice received
    // from the server is all lowercase.
    const currencyPrice = prices.find((p) => p.denom === currency.coinDenom.toLowerCase());

    // Can't find the price for this currency fallback to 0
    if (currencyPrice === undefined) {
      return zeroCoinFiatValue(coin.denom);
    }

    // Factor to convert the coin from its minimal denom to the currency denom.
    const coinConversionFactory = 10 ** currency.coinDecimals;

    // Convert the coin amount.
    // Use en-US locale since the value is represented in this locale.
    const coinAmount = safeParseFloat(coin.amount, 'en-US') / coinConversionFactory;

    return {
      coin,
      fiatValue: coinAmount * currencyPrice.price,
      coinConversionFactory: currencyPrice.price / coinConversionFactory,
      // We hardcode US dollar because the prices api only support this currency.
      currency: 'USD',
      currencySymbol: '$',
    };
  });
};

/**
 * Hook that allows to get the price of a given token.
 * @param coins - The coins to get the price for.
 * @param lazy - Tells if the data should be lazy fetched.
 */
const useTokensPrices = (coins: Coin[], lazy?: boolean) => {
  const {
    data,
    refetch: refetchData,
    loading,
  } = useQuery(GetTokensPrices, {
    variables: {
      denoms: DesmosMainnet.currencies.map((currency) => currency.coinMinimalDenom),
    },
    skip: lazy,
  });

  const refetch = React.useCallback(
    async (providedCoins?: Coin[]) => {
      const result = await refetchData();
      return {
        ...result,
        data: getPrices(result.data, providedCoins ?? coins),
      };
    },
    [coins, refetchData],
  );

  const prices = React.useMemo(() => getPrices(data, coins), [data, coins]);

  return {
    prices,
    loading,
    refetch,
  };
};

export default useTokensPrices;
