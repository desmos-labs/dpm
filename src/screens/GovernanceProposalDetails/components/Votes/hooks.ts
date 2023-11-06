import { useApolloClient } from '@apollo/client';
import { FetchDataFunction, usePaginatedData } from 'hooks/usePaginatedData';
import { GqlGetProposalVotes, ProposalVote } from 'types/proposals';
import GetProposalVotes from 'services/graphql/queries/GetProposalVotes';
import React from 'react';

/**
 * Hook that provides a function that can be used from the
 * {@link usePaginatedData} hook to fetch the votes of a proposal.
 */
const useFetchPaginatedProposalVotes = (proposalId: number) => {
  // Here we use useApolloClient instead of useLazyQuery
  // to force the returned callback to change when the client instance changes
  // so that the usePaginatedData hook can properly update the data.
  const client = useApolloClient();

  return React.useCallback<FetchDataFunction<ProposalVote, undefined>>(
    async (offset, limit) => {
      const { data, error } = await client.query<GqlGetProposalVotes>({
        query: GetProposalVotes,
        fetchPolicy: 'network-only',
        variables: {
          proposalId,
          offset,
          limit,
        },
      });

      if (error) {
        throw error;
      }

      const fetchedProposals = data?.proposalVotes ?? [];

      return {
        data: fetchedProposals,
        endReached: fetchedProposals.length < limit,
      };
    },
    [client, proposalId],
  );
};

/**
 * Hook to fetch the list of votes of a proposal.
 */
export const useFetchProposalVotes = (proposalId: number) =>
  usePaginatedData(useFetchPaginatedProposalVotes(proposalId), {
    itemsPerPage: 20,
    autoFetchFirstPage: true,
  });
