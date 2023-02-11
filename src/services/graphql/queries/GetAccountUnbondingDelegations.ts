import { gql } from '@apollo/client';

/**
 * Gets the account's delegation that are in unboding.
 * @example
 * const { data, loading, error } = useQuery(GetAccountUnbondingDelegations, {
 *   variables: {
 *      address: // value for 'address'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
const GetAccountUnbondingDelegations = gql`
  query GetAccountUnbondingDelegation($address: String!, $limit: Int = 100, $offset: Int = 0) {
    action_unbonding_delegation(address: $address, limit: $limit, offset: $offset) {
      unbonding_delegations
    }
  }
`;

export default GetAccountUnbondingDelegations;
