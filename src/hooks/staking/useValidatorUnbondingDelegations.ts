import { useQuery } from '@apollo/client';
import React from 'react';
import { convertGraphQLUnbondingDelegation } from 'lib/GraphQLUtils';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import GetAccountUnbondingDelegations from 'services/graphql/queries/GetAccountUnbondingDelegations';
import { UnbondingDelegation } from 'types/distribution';

/**
 * Hook that provides the amount of tokens that
 * are currently unbonding from a validator.
 * @param validatorOperatorAddress - Validator from which the unbonding
 * tokens will be fetched.
 * @param accountAddress - Accounts whose unbonding tokens we are interested
 * in retrieving, if undefined will be used the active account address.
 */
const useValidatorUnbondingDelegations = (
  validatorOperatorAddress: string,
  accountAddress?: string,
) => {
  const activeAccountAddress = useActiveAccountAddress();
  const address = accountAddress ?? activeAccountAddress;

  if (address === undefined) {
    throw new Error("Can't find the user delegations if the address is undefined");
  }

  const { data, loading, error } = useQuery(GetAccountUnbondingDelegations, {
    fetchPolicy: 'network-only',
    variables: {
      address,
    },
  });

  const unbondingAmounts = React.useMemo<UnbondingDelegation[] | undefined>(() => {
    if (data === undefined) {
      return undefined;
    }

    return (
      data.action_unbonding_delegation.unbonding_delegations
        .map(convertGraphQLUnbondingDelegation)
        .flatMap((d: UnbondingDelegation[]) => d)
        .filter((d: UnbondingDelegation) => d.validatorAddress === validatorOperatorAddress) ?? []
    );
  }, [data, validatorOperatorAddress]);

  return {
    data: unbondingAmounts,
    loading,
    error,
  };
};

export default useValidatorUnbondingDelegations;
