import { useActiveAccountAddress } from '@recoil/activeAccount';
import { useQuery } from '@apollo/client';
import GetAccountDelegationTotal from 'services/graphql/queries/GetAccountDelegationsTotal';
import React from 'react';
import { coin } from '@cosmjs/amino';

/**
 * Hook that provides the total amount of coins delegated from an account.
 * @param userAddress - Account address, if undefined will be used the address
 * of the current active user.
 */
const useTotalDelegatedAmount = (userAddress?: string) => {
  const activeAccountAddress = useActiveAccountAddress();
  const address = userAddress ?? activeAccountAddress;

  if (address === undefined) {
    throw new Error("can't get staked amount without an active account or a provided address");
  }

  const { data, loading, error, refetch } = useQuery(GetAccountDelegationTotal, {
    variables: {
      address,
    },
  });

  const totalDelegated = React.useMemo(() => {
    if (loading || error || data === undefined) {
      return undefined;
    }
    return data.action_delegation_total.coins.map((c: any) => coin(c.amount, c.denom));
  }, [data, error, loading]);

  return {
    totalDelegated,
    loading,
    error,
    refetch,
  };
};

export default useTotalDelegatedAmount;
