import { gql } from '@apollo/client';

/**
 * Gets the account's delegations.
 * @example
 * const { data, loading, error } = useQuery(GetAccountDelegations, {
 *   variables: {
 *      address: // value for 'address'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
const GetAccountDelegations = gql`
  query GetAccountDelegations($address: String!, $limit: Int = 100, $offset: Int = 0)
  @api(name: forbole) {
    action_delegation(address: $address, limit: $limit, offset: $offset) {
      delegations
    }
  }
`;

export default GetAccountDelegations;
