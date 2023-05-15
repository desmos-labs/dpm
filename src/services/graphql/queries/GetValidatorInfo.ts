import { gql } from '@apollo/client';

/**
 * Query to get a validator informations.
 * @example
 * const { data, loading, error } = useQuery(GetTransactionsByAddress, {
 *   variables: {
 *      operatorAddress: // validator's operator address.
 *   },
 * });
 */
const GetValidatorInfo = gql`
  query GetValidatorInfo($operatorAddress: String!) @api(name: forbole) {
    validator(where: { validator_info: { operator_address: { _eq: $operatorAddress } } }) {
      validator_descriptions {
        moniker
        avatar_url
        details
      }
      validator_info {
        operator_address
        self_delegate_address
      }
    }
  }
`;

export default GetValidatorInfo;
