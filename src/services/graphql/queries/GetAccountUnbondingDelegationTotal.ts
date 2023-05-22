import { gql } from '@apollo/client';

/**
 * Gets the account's total amount of unbonding delegations.
 * @example
 * const { data, loading, error } = useQuery(GetAccountUnbondingDelegationTotal, {
 *   variables: {
 *      address: // value for 'address'
 *   },
 * });
 */
const GetAccountUnbondingDelegationTotal = gql`
  query GetAccountUnbondingDelegationTotal($address: String!) @api(name: forbole) {
    action_unbonding_delegation_total(address: $address) {
      coins
    }
  }
`;

export default GetAccountUnbondingDelegationTotal;
