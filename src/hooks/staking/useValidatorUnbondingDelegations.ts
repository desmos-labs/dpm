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
 * @param accountAddress - Address of the account for which the amount will be retrieved.
 * If undefined, the active account address will be used instead.
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

  const { data, loading, error, refetch } = useQuery(GetAccountUnbondingDelegations, {
    // Use cache-and-network to avoid on-chain sync issues.
    // This might happen if the user returns to a screen where this hook
    // has been used after unbonding some tokens. In this case, the unbonding
    // delegations will be different from the ones on chain.
    fetchPolicy: 'cache-and-network',
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
    refetch,
  };
};

export default useValidatorUnbondingDelegations;
