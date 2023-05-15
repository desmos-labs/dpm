import { useLazyQuery } from '@apollo/client';
import React from 'react';
import { Validator } from 'types/validator';
import { PaginatedResult, usePaginatedData } from 'hooks/usePaginatedData';
import { convertGraphQLValidator } from 'lib/GraphQLUtils';
import GetValidatorsByAddresses from 'services/graphql/queries/GetValidatorsByAddresses';
import useGetGqlValidatorsProfile from 'hooks/profile/useGetGqlValidatorsProfile';
import useUserDelegations from 'hooks/staking/useUserDelegations';

interface FetchDelegationsFilter {
  delegatedValidators: string[];
}

const useFetchValidatorsByAddresses = () => {
  const [getValidatorByAddresses] = useLazyQuery(GetValidatorsByAddresses);
  const getGqlValidatorsProfile = useGetGqlValidatorsProfile();

  return React.useCallback(
    async (
      offset: number,
      limit: number,
      filter?: FetchDelegationsFilter,
    ): Promise<PaginatedResult<Validator>> => {
      const { data } = await getValidatorByAddresses({
        variables: {
          offset,
          limit,
          operatorAddresses: filter?.delegatedValidators ?? [],
        },
      });

      const profiles = await getGqlValidatorsProfile(data.validator);

      const validators = data.validator.map((validator: any) =>
        convertGraphQLValidator(
          validator,
          profiles[validator.validator_info.self_delegate_address],
        ),
      ) as Validator[];

      return {
        data: validators,
      };
    },
    [getValidatorByAddresses, getGqlValidatorsProfile],
  );
};

export const usePaginatedDelegatedValidators = () => {
  const fetchDelegations = useFetchValidatorsByAddresses();
  const {
    data: validators,
    loading: loadingValidators,
    refreshing: refreshingValidators,
    fetchMore: fetchMoreValidators,
    updateFilter: updateValidatorsFilter,
  } = usePaginatedData(fetchDelegations, {
    itemsPerPage: 50,
  });

  const {
    delegations,
    loading: loadingDelegations,
    refetch: refetchDelegations,
  } = useUserDelegations();

  React.useEffect(() => {
    if (!loadingDelegations && delegations !== undefined) {
      updateValidatorsFilter({
        delegatedValidators: delegations.map((d) => d.validatorAddress),
      });
    }
  }, [loadingDelegations, delegations, updateValidatorsFilter]);

  return React.useMemo(
    () => ({
      validators,
      delegations,
      refresh: refetchDelegations,
      loading: loadingDelegations || loadingValidators,
      refreshing: refreshingValidators || loadingDelegations,
      fetchMore: fetchMoreValidators,
    }),
    [
      delegations,
      fetchMoreValidators,
      loadingDelegations,
      loadingValidators,
      refetchDelegations,
      refreshingValidators,
      validators,
    ],
  );
};
