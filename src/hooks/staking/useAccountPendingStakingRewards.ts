import { useActiveAccountAddress } from '@recoil/activeAccount';
import { useQuery } from '@apollo/client';
import GetAccountPendingRewards from 'services/graphql/queries/GetAccountPendingRewards';
import React from 'react';
import { convertGraphQLPendingReward } from 'lib/GraphQLUtils';
import { PendingReward } from 'types/distribution';

/**
 * Hook that provides all the pending staking rewards of a user.
 * @param accountAddress - Address of the account for which to get the
 * pending rewards. If its undefined, the current active account address
 * will be used instead.
 */
const useAccountPendingStakingRewards = (accountAddress?: string) => {
  const activeAccountAddress = useActiveAccountAddress();
  const address = accountAddress ?? activeAccountAddress;

  if (address === undefined) {
    throw new Error("Can't get delegation rewards if address is undefined");
  }

  const { data, loading, error, refetch } = useQuery(GetAccountPendingRewards, {
    fetchPolicy: 'cache-and-network',
    variables: {
      address,
    },
  });

  const convertedPendingRewards = React.useMemo(() => {
    const convertedRewards: PendingReward[] =
      data?.action_delegation_reward?.map(convertGraphQLPendingReward) ?? [];

    return convertedRewards;
  }, [data]);

  return {
    data: convertedPendingRewards,
    loading,
    error,
    refetch,
  };
};

export default useAccountPendingStakingRewards;
