import { useLazyQuery } from '@apollo/client';
import React from 'react';
import { Validator } from 'types/validator';
import GetValidators from 'services/graphql/queries/GetValidators';
import { PaginatedResult } from 'hooks/usePaginatedData';
import { convertGraphQLValidator } from 'lib/GraphQLUtils';
import useGetGqlValidatorsProfile from 'hooks/profile/useGetGqlValidatorsProfile';

interface FetchValidatorFilter {
  moniker: string;
  votingPowerOrder?: 'asc' | 'desc';
  monikerOrder?: 'asc' | 'desc';
}

/**
 * Hook that provides a function that can be used from usePaginatedData
 * to fetch the validators.
 */
export const useFetchValidators = () => {
  const [getValidators] = useLazyQuery(GetValidators);
  const getGqlValidatorsProfile = useGetGqlValidatorsProfile();

  return React.useCallback(
    async (
      offset: number,
      limit: number,
      filter?: FetchValidatorFilter,
    ): Promise<PaginatedResult<Validator>> => {
      const { data, error } = await getValidators({
        variables: {
          offset,
          limit,
          moniker_ilike: `%${filter?.moniker?.trim()}%`,
          moniker_order: filter?.monikerOrder,
          voting_power_order: filter?.votingPowerOrder,
        },
      });

      if (error) {
        throw error;
      }

      const profiles = await getGqlValidatorsProfile(data.validator);

      const validators = data.validator.map((validator: any) =>
        convertGraphQLValidator(
          validator,
          profiles[validator.validator_info.self_delegate_address],
        ),
      ) as Validator[];

      return {
        data: validators,
        endReached: validators.length < limit,
      };
    },
    [getValidators, getGqlValidatorsProfile],
  );
};
