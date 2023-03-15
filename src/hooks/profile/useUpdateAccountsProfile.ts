import { useQuery } from '@apollo/client';
import GetProfileForAddresses from 'services/graphql/queries/GetProfileForAddresses';
import { useStoredAccountsAddresses } from '@recoil/accounts';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';
import { DesmosProfile } from 'types/desmos';
import { useStoreProfiles } from '@recoil/profiles';

/**
 * Hook that updates all the profiles associated to the accounts that the user
 * have imported in the application.
 */
export const useUpdateAccountsProfile = () => {
  const storeProfiles = useStoreProfiles();
  const addresses = useStoredAccountsAddresses();
  useQuery(GetProfileForAddresses, {
    variables: {
      addresses,
    },
    onCompleted: (profilesData) => {
      const convertedProfiles: DesmosProfile[] = profilesData.profile.map(convertGraphQLProfile);
      const reducedProfiles = convertedProfiles.reduce<Record<string, DesmosProfile>>(
        (acc, profile) => {
          acc[profile.address] = profile;
          return acc;
        },
        {},
      );
      storeProfiles(reducedProfiles);
    },
  });
};
