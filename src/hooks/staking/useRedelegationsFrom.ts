import { useQuery } from '@apollo/client';
import React from 'react';
import { convertGraphQLRedelegation } from 'lib/GraphQLUtils';
import { Redelegation } from 'types/distribution';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import GetAccountRedelegations from 'services/graphql/queries/GetAccountRedelegations';

/**
 * Hook that provides the redelegation from a validator torward other ones.
 * @param validatorOperatorAddress - Validator operator address.
 * @param accountAddress - Account that performed the redelegations, if undefined
 * will be used the active account address.
 */
const useRedelegationsFrom = (validatorOperatorAddress: string, accountAddress?: string) => {
  const activeAccountAddress = useActiveAccountAddress();
  const address = accountAddress ?? activeAccountAddress;

  if (address === undefined) {
    throw new Error("Can't find the user redelegation if the address is undefined");
  }

  const { data, loading, error } = useQuery(GetAccountRedelegations, {
    fetchPolicy: 'network-only',
    variables: {
      address,
    },
  });

  const redelegations = React.useMemo(() => {
    if (data === undefined) {
      return undefined;
    }

    return data.action_redelegation.redelegations
      .map(convertGraphQLRedelegation)
      .flatMap((r: Redelegation[]) => r)
      .filter(
        (r: Redelegation) => r.validatorSrcAddress === validatorOperatorAddress,
      ) as Redelegation[];
  }, [data, validatorOperatorAddress]);

  return {
    data: redelegations,
    loading,
    error,
  };
};

export default useRedelegationsFrom;
