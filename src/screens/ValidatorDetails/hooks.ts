import { useQuery } from '@apollo/client';
import React from 'react';
import GetValidatorTotalDelegations from 'services/graphql/queries/GetValidatorTotalDelegations';
import GetTotalVotingPower from 'services/graphql/queries/GetTotalVotingPower';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import useReturnToCurrentScreen from 'hooks/useReturnToCurrentScreen';
import ROUTES from 'navigation/routes';
import { Validator } from 'types/validator';

/**
 * Hook that provides the total number of delegations toward a validator.
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
 * Hook that provides the total chain voting power.
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

/**
 * Hook that provides a function to stake some coins torward a validator.
 */
export const useStake = () => {
  const navigation = useNavigation<NavigationProp<RootNavigatorParamList>>();
  const returnToCurrentScreen = useReturnToCurrentScreen();

  return React.useCallback(
    (validator: Validator) => {
      navigation.navigate(ROUTES.STAKE, {
        validator,
        onSuccess: returnToCurrentScreen,
      });
    },
    [navigation, returnToCurrentScreen],
  );
};
