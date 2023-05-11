import { useApolloClient } from '@apollo/client';
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

export const useFetchValidators = () => {
  const client = useApolloClient();
  const getGqlValidatorsProfile = useGetGqlValidatorsProfile();

  return React.useCallback(
    async (
      offset: number,
      limit: number,
      filter?: FetchValidatorFilter,
    ): Promise<PaginatedResult<Validator>> => {
      const { data } = await client.query({
        query: GetValidators,
        variables: {
          offset,
          limit,
          moniker_ilike: `%${filter?.moniker?.trim()}%`,
          moniker_order: filter?.monikerOrder,
          voting_power_order: filter?.votingPowerOrder,
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
        endReached: validators.length < limit,
      };
    },
    [client, getGqlValidatorsProfile],
  );
};
