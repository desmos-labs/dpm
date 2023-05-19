import { useActiveAccountAddress } from '@recoil/activeAccount';
import { useQuery } from '@apollo/client';
import GetAccountDelegationTotal from 'services/graphql/queries/GetAccountDelegationsTotal';
import React from 'react';
import { coin } from '@cosmjs/amino';
import { useCurrentChainInfo } from '@recoil/settings';
import { Coin } from '@desmoslabs/desmjs-types/cosmos/base/v1beta1/coin';

/**
 * Hook that provides the total amount of coins delegated from an account.
 * @param userAddress - Address of the account whose total will be calculated.
 * If undefined, the address of the current active user will be used instead.
 */
const useTotalDelegatedAmount = (userAddress?: string) => {
  const activeAccountAddress = useActiveAccountAddress();
  const address = userAddress ?? activeAccountAddress;
  const chainInfo = useCurrentChainInfo();

  if (address === undefined) {
    throw new Error("can't get staked amount without an active account or a provided address");
  }

  const { data, loading, error, refetch } = useQuery(GetAccountDelegationTotal, {
    variables: {
      address,
    },
    // Use network-only to avoid on-chain amounts sync issues. 
    // This might happen if the user returns to a screen where this hook
    // has been used after performing a delegation. In this case, the total 
    // amount will be different from the amount staked on chain.
    fetchPolicy: 'network-only',
  });

  const totalDelegated = React.useMemo(() => {
    if (loading || error || data === undefined) {
      return undefined;
    }
    const converted: Coin[] = data.action_delegation_total.coins.map((c: any) =>
      coin(c.amount, c.denom),
    );

    if (converted.length === 0) {
      // If the user don't have any delegation fallback to a zero amount.
      converted.push(coin(0, chainInfo.stakeCurrency.coinMinimalDenom));
    }
    return converted;
  }, [chainInfo.stakeCurrency.coinMinimalDenom, data, error, loading]);

  return {
    totalDelegated,
    loading,
    error,
    refetch,
  };
};

export default useTotalDelegatedAmount;
