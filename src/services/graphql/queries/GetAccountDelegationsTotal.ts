import { gql } from '@apollo/client';

/**
 * Gets the account's total delegated amount.
 * @example
 * const { data, loading, error } = useQuery(GetAccountDelegationTotal, {
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
const GetAccountDelegationTotal = gql`
  query GetAccountDelegationTotal($address: String!) @api(name: forbole) {
    action_delegation_total(address: $address) {
      coins
    }
  }
`;

export default GetAccountDelegationTotal;
