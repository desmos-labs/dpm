import { gql } from '@apollo/client';

/**
 * GQL Query that provides the data required to
 * calculate the staking APR of a validator.
 */
const GetValidatorAprData = gql`
  query GetAprInfo @api(name: forbole) {
    inflation {
      value
    }
    distribution_params {
      params
    }
    supply {
      coins
    }
    staking_pool {
      bonded_tokens
    }
  }
`;

export default GetValidatorAprData;
