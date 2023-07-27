import { gql } from '@apollo/client';
import ProfileFields from 'services/graphql/queries/fragments/ProfilesFields';

/**
 * Gets the profiles that have the nickname or dtag that matches the provided
 * like expression or a profile that matches the provided address.
 * @example
 * const { data, loading, error } = useQuery(GetProfilesFromNickNameOrDtag, {
 *   variables: {
 *      likeExpression: // like expression used to find the profiles
 *      address: // address that will be used to search the profile
 *      limit
 *      offset
 *   },
 * });
 */
const GetProfilesFromNickNameOrDtagOrAddress = gql`
  ${ProfileFields}
  query GetProfilesFromNickNameOrDtag(
    $likeExpression: String
    $address: String
    $limit: Int = 100
    $offset: Int = 0
  ) @api(name: desmos) {
    profile(
      where: {
        _or: [
          { dtag: { _ilike: $likeExpression } }
          { nickname: { _ilike: $likeExpression } }
          { address: { _eq: $address } }
        ]
      }
      limit: $limit
      offset: $offset
      order_by: { creation_time: asc }
    ) {
      ...ProfileFields
    }
  }
`;

export default GetProfilesFromNickNameOrDtagOrAddress;
