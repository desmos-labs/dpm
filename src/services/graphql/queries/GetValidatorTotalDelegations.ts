import { gql } from '@apollo/client';

/**
 * Gets the total number of delgations toward a validator.
 * @example
 * const { data, loading, error } = useQuery(GetValidatorTotalDelegations, {
 *   variables: {
 *      validatorAddress: // validator address
 *   },
 * });
 */
const GetValidatorTotalDelegations = gql`
  query GetValidatorTotalDelegations($validatorAddress: String = "") @api(name: forbole) {
    action_validator_delegations(address: $validatorAddress, count_total: true) {
      pagination
    }
  }
`;

export default GetValidatorTotalDelegations;
