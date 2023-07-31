import { useActiveAccountAddress } from '@recoil/activeAccount';
import { useCurrentChainInfo } from '@recoil/settings';
import { useLazyQuery } from '@apollo/client';
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

  const [getAccountBalance] = useLazyQuery(GetAccountBalance, {
    variables: { address },
    fetchPolicy: 'network-only',
  });

  return React.useCallback(async () => {
    const { data } = await getAccountBalance();

    const userBalance: Coin | undefined = data?.accountBalance?.coins?.find(
      (c: Coin) => c.denom === currentChainInfo.stakeCurrency.coinMinimalDenom,
    );

    return userBalance ?? coin('0', currentChainInfo.stakeCurrency.coinMinimalDenom);
  }, [currentChainInfo.stakeCurrency.coinMinimalDenom, getAccountBalance]);
};

/**
 * Hook that provide a function to get the amount of coins that the current
 * active user have delegated to a validator.
 */
const useGetDelegatedToValidator = () => {
  const address = useActiveAccountAddress()!;
  const currentChainInfo = useCurrentChainInfo();

  const [getAccountDelegations] = useLazyQuery(GetAccountDelegations, {
    variables: { address },
    fetchPolicy: 'network-only',
  });

  return React.useCallback(
    async (validatorAddress: string) => {
      const { data } = await getAccountDelegations();
      const coins: Coin[] | undefined = data?.action_delegation?.delegations
        ?.map(convertGraphQLDelegation)
        ?.find((d: Delegation) => d.validatorAddress === validatorAddress)?.coins;

      return (
        coins?.find((c) => c.denom === currentChainInfo.stakeCurrency.coinMinimalDenom) ??
        coin(0, currentChainInfo.stakeCurrency.coinMinimalDenom)
      );
    },
    [currentChainInfo.stakeCurrency.coinMinimalDenom, getAccountDelegations],
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

  const fetchAmount = React.useCallback(async () => {
    setLoading(true);
    let computedAmount: CoinFiatValue | undefined;

    if (amountLimitConfig.mode === AmountLimit.UserBalance) {
      const userBalance = await getUserBalance();
      const { data: prices } = await getTokenPrices([userBalance]);
      [computedAmount] = prices;
    } else if (amountLimitConfig.mode === AmountLimit.DelegatedToValidator) {
      const delegated = await getDelegateToValidator(amountLimitConfig.validatorAddress);
      const { data: prices } = await getTokenPrices([delegated]);
      [computedAmount] = prices;
    }
    setAmount(computedAmount ?? zeroCoinFiatValue(chainInfo.stakeCurrency.coinMinimalDenom));
    setLoading(false);
  }, [
    amountLimitConfig,
    chainInfo.stakeCurrency.coinMinimalDenom,
    getDelegateToValidator,
    getTokenPrices,
    getUserBalance,
  ]);

  React.useEffect(() => {
    fetchAmount();
  }, [fetchAmount]);

  return { amount, loading, refetch: fetchAmount };
};
