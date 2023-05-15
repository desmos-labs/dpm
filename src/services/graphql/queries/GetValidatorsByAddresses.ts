import { gql } from '@apollo/client';

/**
 * Gets the list of validators.
 * @example
 * const { data, loading, error } = useQuery(GetValidators, {
 *   variables: {
 *      moniker_ilike: // value for 'moniker_ilike'
 *      voting_power_order: // value for 'voting_power_order'
 *      moniker_order: // value for 'moniker_order'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      operatorAddresses: // list of operator addresses.
 *   },
 * });
 */
const GetValidators = gql`
  query GetValidators(
    $voting_power_order: order_by
    $moniker_order: order_by
    $limit: Int = 100
    $offset: Int = 0
    $operatorAddresses: [String!] = []
  ) @api(name: forbole) {
    validator(
      order_by: {
        validator_voting_powers_aggregate: { max: { voting_power: $voting_power_order } }
        validator_descriptions_aggregate: { max: { moniker: $moniker_order } }
      }
      where: {
        validator_statuses: { status: { _eq: 3 } }
        validator_info: { operator_address: { _in: $operatorAddresses } }
      }
      limit: $limit
      offset: $offset
    ) {
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

export default GetValidators;
