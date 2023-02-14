import { useApolloClient } from '@apollo/client';
import React from 'react';
import { Validator } from 'types/validator';
import GetValidators from 'services/graphql/queries/GetValidators';
import { PaginatedResult } from 'hooks/usePaginatedData';

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
      const { data } = await client.query({
        query: GetValidators,
        variables: {
          offset,
          limit,
          moniker_ilike: `%${filter?.text?.trim()}%`,
          moniker_order: filter?.monikerOrder,
          voting_power_order: filter?.votingPowerOrder,
        },
        fetchPolicy: 'network-only',
      });

      const validators = data.validator.map(
        (validator: any) =>
          ({
            address: validator.validator_descriptions[0].validator_address,
            commission: validator.validator_commissions[0].commission,
            moniker: validator.validator_descriptions[0].moniker,
            votingPower: validator.validator_voting_powers[0].voting_power,
            website: validator.validator_descriptions[0].website ?? undefined,
            avatarUrl: validator.validator_descriptions[0].avatar_url ?? undefined,
          } as Validator),
      );

      return {
        data: validators,
      };
    },
    [client],
  );
};
