import { gql } from '@apollo/client';
import ProfileFields from 'services/graphql/queries/fragments/ProfilesFields';

/**
 * Gets the profiles that have the nickname or dtag that matches the provided
 * like expression.
 * @example
 * const { data, loading, error } = useQuery(GetProfilesFromNickNameOrDtag, {
 *   variables: {
 *      likeExpression: // like expression used to find the profiles
 *      limit
 *      offset
 *   },
 * });
 */
const GetProfilesFromNickNameOrDtag = gql`
  ${ProfileFields}
  query GetProfilesFromNickNameOrDtag($likeExpression: String, $limit: Int = 100, $offset: Int = 0)
  @api(name: desmos) {
    profile(
      where: {
        _or: [{ dtag: { _ilike: $likeExpression } }, { nickname: { _ilike: $likeExpression } }]
      }
      limit: $limit
      offset: $offset
      order_by: { creation_time: asc }
    ) {
      ...ProfileFields
    }
  }
`;

export default GetProfilesFromNickNameOrDtag;
