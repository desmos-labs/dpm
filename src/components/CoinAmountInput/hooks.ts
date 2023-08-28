import { useActiveAccountAddress } from '@recoil/activeAccount';
import { useCurrentChainInfo } from '@recoil/settings';
import { useApolloClient } from '@apollo/client';
import GetAccountBalance from 'services/graphql/queries/GetAccountBalance';
import React from 'react';
import { coin } from '@cosmjs/amino';
import { Coin } from '@desmoslabs/desmjs';
import GetAccountDelegations from 'services/graphql/queries/GetAccountDelegations';
import { convertGraphQLDelegation } from 'lib/GraphQLUtils';
import { Delegation } from 'types/distribution';
import useTokensPrices from 'hooks/balance/useTokensPrices';
import { CoinFiatValue, zeroCoinFiatValue } from 'types/prices';
import { AmountLimit, AmountLimitConfig } from './limits';

/**
 * Hook that provides a function to get the current active account balance.
 */
const useGetActiveAccountBalance = () => {
  const address = useActiveAccountAddress()!;
  const currentChainInfo = useCurrentChainInfo();
  const apolloClient = useApolloClient();

  return React.useCallback(
    async (abortController: AbortController) => {
      // Use the client directly to handle the case where the chain is changed
      // while displaying this component.
      const { data } = await apolloClient.query({
        query: GetAccountBalance,
        variables: { address },
        fetchPolicy: 'network-only',
        context: {
          fetchOptions: {
            signal: abortController.signal,
          },
        },
      });

      const userBalance: Coin | undefined = data?.accountBalance?.coins?.find(
        (c: Coin) => c.denom === currentChainInfo.stakeCurrency.coinMinimalDenom,
      );

      return userBalance ?? coin('0', currentChainInfo.stakeCurrency.coinMinimalDenom);
    },
    [apolloClient, address, currentChainInfo.stakeCurrency.coinMinimalDenom],
  );
};

/**
 * Hook that provide a function to get the amount of coins that the current
 * active user have delegated to a validator.
 */
const useGetDelegatedToValidator = () => {
  const address = useActiveAccountAddress()!;
  const currentChainInfo = useCurrentChainInfo();
  const apolloClient = useApolloClient();

  return React.useCallback(
    async (abortController: AbortController, validatorAddress: string) => {
      // Use the client directly to handle the case where the chain is changed
      // while displaying this component.
      const { data } = await apolloClient.query({
        query: GetAccountDelegations,
        variables: { address },
        fetchPolicy: 'network-only',
        context: {
          fetchOptions: {
            signal: abortController.signal,
          },
        },
      });
      const coins: Coin[] | undefined = data?.action_delegation?.delegations
        ?.map(convertGraphQLDelegation)
        ?.find((d: Delegation) => d.validatorAddress === validatorAddress)?.coins;

      return (
        coins?.find((c) => c.denom === currentChainInfo.stakeCurrency.coinMinimalDenom) ??
        coin(0, currentChainInfo.stakeCurrency.coinMinimalDenom)
      );
    },
    [currentChainInfo.stakeCurrency.coinMinimalDenom, apolloClient, address],
  );
};

/**
 * Hook that provides the coin limit that the user can be input.
 * @param amountLimitConfig - Configurations used to fetch the limit amount.
 */
export const useAmountInputLimit = (amountLimitConfig: AmountLimitConfig) => {
  const [amount, setAmount] = React.useState<CoinFiatValue>();
  const [loading, setLoading] = React.useState(true);

  const chainInfo = useCurrentChainInfo();
  const getUserBalance = useGetActiveAccountBalance();
  const getDelegateToValidator = useGetDelegatedToValidator();
  const { refetch: getTokenPrices } = useTokensPrices(
    React.useMemo(() => [], []),
    true,
  );

  const fetchAmount = React.useCallback(
    async (abortController: AbortController) => {
      setLoading(true);
      let computedAmount: CoinFiatValue | undefined;

      if (amountLimitConfig.mode === AmountLimit.UserBalance) {
        const userBalance = await getUserBalance(abortController);
        const { data: prices } = await getTokenPrices([userBalance]);
        [computedAmount] = prices;
      } else if (amountLimitConfig.mode === AmountLimit.DelegatedToValidator) {
        const delegated = await getDelegateToValidator(
          abortController,
          amountLimitConfig.validatorAddress,
        );
        const { data: prices } = await getTokenPrices([delegated]);
        [computedAmount] = prices;
      }
      const coins =
        computedAmount ?? zeroCoinFiatValue(coin(0, chainInfo.stakeCurrency.coinMinimalDenom));
      setAmount(coins);
      setLoading(false);
      return coins;
    },
    [
      amountLimitConfig,
      chainInfo.stakeCurrency.coinMinimalDenom,
      getDelegateToValidator,
      getTokenPrices,
      getUserBalance,
    ],
  );

  React.useEffect(() => {
    const abortController = new AbortController();
    fetchAmount(abortController);
    return () => abortController.abort();
  }, [fetchAmount]);

  return { amount, loading, refetch: fetchAmount };
};
