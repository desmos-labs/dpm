import { Validator } from 'types/validator';
import { useQuery } from '@apollo/client';
import GetValidatorAprData from 'services/graphql/queries/GetValidatorAprData';
import React from 'react';
import { Coin } from '@desmoslabs/desmjs';
import { useCurrentChainInfo } from '@recoil/settings';
import { roundFloat, safeParseInt, safePartFloat } from 'lib/FormatUtils';

/**
 * Hook that provides the staking apr of a validator.
 * @param validator - Validator for which to calculate the apr.
 */
const useValidatorStakingApr = (validator: Validator) => {
  const { data, loading, error } = useQuery(GetValidatorAprData, {
    fetchPolicy: 'cache-first',
  });
  const chainInfo = useCurrentChainInfo();

  const apr = React.useMemo(() => {
    if (loading || error) {
      return undefined;
    }

    const inflation: number = data.inflation[0].value;
    const communityTax = safePartFloat(data.distribution_params[0].params.community_tax);
    const supply = safeParseInt(
      (data.supply[0].coins as Coin[]).find(
        (c) => c.denom === chainInfo.stakeCurrency.coinMinimalDenom,
      )?.amount!,
    );
    const bondedTokens = safeParseInt(data.staking_pool[0].bonded_tokens);
    const stakingApr = (inflation * (1 - communityTax)) / (bondedTokens / supply);

    const validatorApr = stakingApr * (1 - validator.commission);
    const validatorAprPercentage = validatorApr * 100;
    return roundFloat(validatorAprPercentage, 2);
  }, [validator, data, loading, error, chainInfo]);

  return { data: apr, loading, error };
};

export default useValidatorStakingApr;
