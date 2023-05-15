import { useLazyQuery } from '@apollo/client';
import React from 'react';
import GetProfileForAddresses from 'services/graphql/queries/GetProfileForAddresses';
import { DesmosProfile } from 'types/desmos';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';

/**
 * Hook that provides a function to fetch the profiles associated to a list of
 * validator fetched from GraphQL.
 */
const useGetGqlValidatorsProfile = () => {
  const [getProfileForAddresses] = useLazyQuery(GetProfileForAddresses);

  return React.useCallback(
    async (validators: any[]) => {
      const selfDelegateAddresses = validators.map(
        (validator: any) => validator.validator_info.self_delegate_address,
      );

      const { data: profilesData } = await getProfileForAddresses({
        variables: {
          addresses: selfDelegateAddresses,
        },
      });

      const profiles: Record<string, DesmosProfile> = (<Array<any>>profilesData.profile)
        .map(convertGraphQLProfile)
        .reduce((acc: Record<string, DesmosProfile>, profile) => {
          if (profile !== undefined) {
            acc[profile.address] = profile;
          }
          return acc;
        }, {});

      return profiles;
    },
    [getProfileForAddresses],
  );
};

export default useGetGqlValidatorsProfile;
