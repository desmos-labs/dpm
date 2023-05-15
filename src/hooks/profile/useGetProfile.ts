import { ApolloError, useApolloClient } from '@apollo/client';
import { err, ok, Result } from 'neverthrow';
import React from 'react';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';
import { DesmosProfile } from 'types/desmos';

/**
 * Hook that provides a function to get the profile of an account from
 * its address.
 */
const useGetProfile = () => {
  const apolloClient = useApolloClient();

  return React.useCallback(
    async (address: string): Promise<Result<DesmosProfile | undefined, ApolloError>> => {
      const { data, error } = await apolloClient.query({
        query: GetProfileForAddress,
        variables: {
          address,
        },
      });

      if (error) {
        return err(error);
      }

      return ok(data.profile[0] as DesmosProfile);
    },
    [apolloClient],
  );
};

export default useGetProfile;
