import { useQuery } from '@apollo/client';
import React from 'react';
import { convertGraphQLDelegation } from 'lib/GraphQLUtils';
import GetAccountDelegations from 'services/graphql/queries/GetAccountDelegations';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import { Delegation } from 'types/distribution';

/**
 * Hook that provides the list of delegations of a user.
 * @param userAddress - Address of the user whose delegations will be loaded,
 * if undefined will be used the current active account address.
 */
const useUserDelegations = (userAddress?: string) => {
  const activeAccountAddress = useActiveAccountAddress();
  const address = userAddress ?? activeAccountAddress;

  if (address === undefined) {
    throw new Error("can't get staked amount without an active account or a provided address");
  }

  const { data, loading, error, refetch } = useQuery(GetAccountDelegations, {
    variables: {
      address,
    },
  });

  const delegations = React.useMemo<Delegation[] | undefined>(() => {
    if (loading || error) {
      return undefined;
    }

    return data?.action_delegation.delegations.map(convertGraphQLDelegation);
  }, [data, error, loading]);

  return {
    delegations,
    loading,
    error,
    refetch,
  };
};

export default useUserDelegations;
