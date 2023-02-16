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
 *   },
 * });
 */
const GetValidators = gql`
  query GetValidators(
    $moniker_ilike: String = "%"
    $voting_power_order: order_by
    $moniker_order: order_by
    $limit: Int = 100
    $offset: Int = 0
  ) @api(name: forbole) {
    validator(
      order_by: {
        validator_voting_powers_aggregate: { max: { voting_power: $voting_power_order } }
        validator_descriptions_aggregate: { max: { moniker: $moniker_order } }
      }
      where: {
        validator_voting_powers: {
          validator: { validator_descriptions: { moniker: { _ilike: $moniker_ilike } } }
        }
        validator_statuses: { status: { _eq: 3 } }
      }
      limit: $limit
      offset: $offset
    ) {
      validator_descriptions {
        avatar_url
        details
        moniker
        validator_address
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
      }
    }
  }
`;

export interface GQLValidator {
  validator_descriptions: {
    validator_address: string;
    details: string;
    moniker: string;
    avatar_url: string | null;
    website: string | null;
  }[];
  validator_voting_powers: {
    voting_power: number;
  }[];
  validator_commissions: {
    commission: number;
  }[];
  validator_statuses: {
    status: number;
  }[];
}

export interface GQLGetValidators {
  validator: GQLValidator[];
}

export default GetValidators;
