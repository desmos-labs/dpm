import { useQuery } from '@apollo/client';
import React from 'react';
import GetValidatorTotalDelegations from 'services/graphql/queries/GetValidatorTotalDelegations';
import GetTotalVotingPower from 'services/graphql/queries/GetTotalVotingPower';

/**
 * Hooks that provides the total number of delegations toward a validator.
 * @param validatorAddress - Validator operator address.
 */
export const useTotalValidatorDelegations = (validatorAddress: string) => {
  const { data, loading, error } = useQuery(GetValidatorTotalDelegations, {
    variables: {
      validatorAddress,
    },
    fetchPolicy: 'cache-first',
  });

  const totalDelegations = React.useMemo(() => {
    if (loading || error) {
      return undefined;
    }

    return data.action_validator_delegations.pagination.total as number;
  }, [data, loading, error]);

  return React.useMemo(
    () => ({ data: totalDelegations, loading, error }),
    [totalDelegations, loading, error],
  );
};

/**
 * Hooks that provides the total chain voting power.
 */
export const useTotalVotingPower = () => {
  const { data, loading, error } = useQuery(GetTotalVotingPower, {
    fetchPolicy: 'cache-first',
  });

  const totalVotingPower = React.useMemo(() => {
    if (loading || error) {
      return undefined;
    }

    return data.validator_voting_power_aggregate.aggregate.sum.voting_power as number;
  }, [data, loading, error]);

  return React.useMemo(
    () => ({ data: totalVotingPower, loading, error }),
    [totalVotingPower, loading, error],
  );
};
