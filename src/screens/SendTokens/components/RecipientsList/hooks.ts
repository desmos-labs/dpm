import React from 'react';
import { FetchDataFunction, usePaginatedData } from 'hooks/usePaginatedData';
import { DesmosProfile } from 'types/desmos';
import { useApolloClient } from '@apollo/client';
import GetProfilesFromNickNameOrDtagOrAddress from 'services/graphql/queries/GetProfilesFromNickNameOrDtagOrAddress';

/**
 * Hook that provides the function that can be used
 */
const useFetchProfiles = () => {
  const apolloClient = useApolloClient();

  return React.useCallback<FetchDataFunction<DesmosProfile, string>>(
    async (offset, limit, filter) => {
      if (filter === undefined || filter.length === 0) {
        return {
          data: [],
          endReached: true,
        };
      }

      let addressFilter = '';
      if (filter.indexOf('desmos1') === 0 && filter.length === 45) {
        addressFilter = filter;
      }

      const { data, error } = await apolloClient.query({
        query: GetProfilesFromNickNameOrDtagOrAddress,
        fetchPolicy: 'network-only',
        variables: {
          likeExpression: `%${filter}%`,
          address: addressFilter,
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
