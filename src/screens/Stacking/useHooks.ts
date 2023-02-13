import { useApolloClient } from '@apollo/client';
import React from 'react';
import { Validator } from 'types/validator';
import GetValidators from 'services/graphql/queries/GetValidators';

export const useFetchValidators = () => {
  const client = useApolloClient();

  return React.useCallback(
    async (startIndex: number, endIndex: number): Promise<Validator[] | null> => {
      console.log('query', startIndex, endIndex);
      const { data } = await client.query({
        query: GetValidators,
        variables: {
          offset: startIndex,
          limit: endIndex - startIndex,
        },
        fetchPolicy: 'network-only',
      });

      if (data.validator.length === 0) {
        return null;
      }

      return data.validator.map(
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
    },
    [client],
  );
};
