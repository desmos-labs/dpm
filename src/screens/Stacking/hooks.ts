import { useApolloClient } from '@apollo/client';
import React from 'react';
import { Validator } from 'types/validator';
import GetValidators, { GQLGetValidators } from 'services/graphql/queries/GetValidators';
import { PaginatedResult } from 'hooks/usePaginatedData';
import { convertGraphQLValidator } from 'lib/GraphQLUtils';

interface FetchValidatorFilter {
  text: string;
  votingPowerOrder?: 'asc' | 'desc';
  monikerOrder?: 'asc' | 'desc';
}

export const useFetchValidators = () => {
  const client = useApolloClient();

  return React.useCallback(
    async (
      offset: number,
      limit: number,
      filter?: FetchValidatorFilter,
    ): Promise<PaginatedResult<Validator>> => {
      const { data } = await client.query<GQLGetValidators>({
        query: GetValidators,
        variables: {
          offset,
          limit,
          moniker_ilike: `%${filter?.text?.trim()}%`,
          moniker_order: filter?.monikerOrder,
          voting_power_order: filter?.votingPowerOrder,
        },
      });

      return {
        data: data.validator.map(convertGraphQLValidator),
      };
    },
    [client],
  );
};
