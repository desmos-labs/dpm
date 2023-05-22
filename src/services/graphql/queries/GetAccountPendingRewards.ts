import { gql } from '@apollo/client';

/**
 * @example
 * const { data, loading, error } = useQuery(GetAccountPendingRewards, {
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
const GetAccountPendingRewards = gql`
  query GetAccountPendingRewards($address: String!) @api(name: forbole) {
    action_delegation_reward(address: $address) {
      coins
      validator_address
    }
  }
`;

export default GetAccountPendingRewards;
