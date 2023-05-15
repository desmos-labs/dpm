import { useQuery } from '@apollo/client';
import GetStakingParams from 'services/graphql/queries/GetStakingParams';
import React from 'react';

/**
 * Hooks that provides the staking unbonding time in days.
 */
const useStakingUnbondingDays = () => {
  const { data, error, loading } = useQuery(GetStakingParams);

  const ubbondingTime = React.useMemo(() => {
    if (error || loading) {
      return undefined;
    }

    const ubondingTimeNs = data.staking_params[0]?.params.unbonding_time ?? 0;
    // Convert unbonding time from ns to days.
    return ubondingTimeNs / (1_000_000_000 * 3600 * 24);
  }, [data, error, loading]);

  return React.useMemo(
    () => ({
      data: ubbondingTime,
      error,
      loading,
    }),
    [ubbondingTime, error, loading],
  );
};

export default useStakingUnbondingDays;
