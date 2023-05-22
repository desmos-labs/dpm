import { useActiveAccountAddress } from '@recoil/activeAccount';
import { useQuery } from '@apollo/client';
import React from 'react';
import { coin } from '@cosmjs/amino';
import { useCurrentChainInfo } from '@recoil/settings';
import { Coin } from '@desmoslabs/desmjs-types/cosmos/base/v1beta1/coin';
import GetAccountUnbondingDelegationTotal from 'services/graphql/queries/GetAccountUnbondingDelegationTotal';

/**
 * Hook that provides the total amount of coins that an account is unbonding.
 * @param userAddress - Address of the account for which the amount will be calculated.
 * If undefined, the address of the current active user will be used instead.
 */
const useTotalDelegatedAmount = (userAddress?: string) => {
  const activeAccountAddress = useActiveAccountAddress();
  const address = userAddress ?? activeAccountAddress;
  const chainInfo = useCurrentChainInfo();

  if (address === undefined) {
    throw new Error("can't get staked amount without an active account or a provided address");
  }

  const { data, loading, error, refetch } = useQuery(GetAccountUnbondingDelegationTotal, {
    variables: {
      address,
    },
    // Use network-only otherwise if the user returns to a screen where this hook
    // has been used after performing an unbonding action the total amount
    // will be different from the amount staked on chain.
    fetchPolicy: 'network-only',
  });

  const totalUnbonding = React.useMemo(() => {
    const coins: Coin[] = data?.action_unbonding_delegation_total?.coins ?? [];

    if (coins.length === 0) {
      // If the user don't have any unbonding tokens fallback to a zero amount.
      coins.push(coin(0, chainInfo.stakeCurrency.coinMinimalDenom));
    }

    return coins;
  }, [chainInfo.stakeCurrency.coinMinimalDenom, data]);

  return {
    totalUnbonding,
    loading,
    error,
    refetch,
  };
};

export default useTotalDelegatedAmount;
