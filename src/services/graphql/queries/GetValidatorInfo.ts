import { gql } from '@apollo/client';

/**
 * Query to get a validator information.
 * @example
 * const { data, loading, error } = useQuery(GetTransactionsByAddress, {
 *   variables: {
 *      operatorAddress: // validator's operator address.
 *      selfDelegateAddress: // validator's self delegate address.
 *   },
 * });
 */
const GetValidatorInfo = gql`
  query GetValidatorInfo($operatorAddress: String = "", $selfDelegateAddress: String = "")
  @api(name: forbole) {
    validator(
      where: {
        _or: [
          { validator_info: { operator_address: { _eq: $operatorAddress } } }
          { validator_info: { self_delegate_address: { _eq: $selfDelegateAddress } } }
        ]
      }
    ) {
      validator_descriptions {
        moniker
        avatar_url
        details
      }
      validator_descriptions {
        avatar_url
        details
        moniker
        website
      }
      validator_voting_powers {
        voting_power
      }
      validator_commissions {
        commission
      }
      validator_statuses {
        status
        jailed
        tombstoned
      }
      validator_info {
        operator_address
        self_delegate_address
      }
    }
  }
`;

export default GetValidatorInfo;
