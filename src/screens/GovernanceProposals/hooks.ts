import { useApolloClient } from '@apollo/client';
import React from 'react';
import { FetchDataFunction, usePaginatedData } from 'hooks/usePaginatedData';
import { GqlGetProposals, Proposal } from 'types/proposals';
import GetProposals from 'services/graphql/queries/GetProposals';

/**
 * Hook that provides a function that can be used from the
 * {@link usePaginatedData} hook to fetch the proposals.
 */
const useFetchPaginatedProposals = () => {
  // Here we use useApolloClient instead of useLazyQuery
  // to force the returned callback to change when the client instance changes
  // so that the usePaginatedData hook can properly update the data.
  const client = useApolloClient();

  return React.useCallback<FetchDataFunction<Proposal, undefined>>(
    async (offset, limit) => {
      const { data, error } = await client.query<GqlGetProposals>({
        query: GetProposals,
        fetchPolicy: 'network-only',
        variables: {
          offset,
          limit,
        },
      });

      if (error) {
        throw error;
      }

      const fetchedProposals = data?.proposal ?? [];

      return {
        data: fetchedProposals,
        endReached: fetchedProposals.length < limit,
      };
    },
    [client],
  );
};

/**
 * Hook to fetch the list of proposals.
 */
export const useFetchProposals = () =>
  usePaginatedData(useFetchPaginatedProposals(), {
    itemsPerPage: 20,
  });
