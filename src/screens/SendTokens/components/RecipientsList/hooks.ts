import React from 'react';
import { FetchDataFunction, usePaginatedData } from 'hooks/usePaginatedData';
import { DesmosProfile } from 'types/desmos';
import { useApolloClient } from '@apollo/client';
import GetProfilesFromNickNameOrDtag from 'services/graphql/queries/GetProfilesFromNickNameOrDtag';

/**
 * Hook that provides the function that can be used
 */
const useFetchProfiles = () => {
  const apolloClient = useApolloClient();

  return React.useCallback<FetchDataFunction<DesmosProfile, string>>(
    async (offset, limit, filter) => {
      if (filter === undefined) {
        return {
          data: [],
          endReached: true,
        };
      }

      const { data, error } = await apolloClient.query({
        query: GetProfilesFromNickNameOrDtag,
        fetchPolicy: 'network-only',
        variables: {
          likeExpression: `%${filter}%`,
          limit,
          offset,
        },
      });

      if (error) {
        throw error;
      }

      const profiles: DesmosProfile[] = data?.profile ?? [];

      return {
        data: profiles,
        endReached: profiles.length < limit,
      };
    },
    [apolloClient],
  );
};

export const useProfilesFromNickNameOrDtag = () =>
  usePaginatedData<DesmosProfile, string>(
    useFetchProfiles(),
    {
      itemsPerPage: 20,
    },
    '',
  );
