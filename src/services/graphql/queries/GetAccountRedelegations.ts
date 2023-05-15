import { gql } from '@apollo/client';

/**
 * Gets the account's redelegations.
 * @example
 * const { data, loading, error } = useQuery(GetAccountRedelegations, {
 *   variables: {
 *      address: // value for 'address'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
const GetAccountRedelegations = gql`
  query GetAccountRedelegations($address: String!, $limit: Int = 100, $offset: Int = 0) {
    action_redelegation(address: $address, limit: $limit, offset: $offset) {
      redelegations
    }
  }
`;

export default GetAccountRedelegations;
