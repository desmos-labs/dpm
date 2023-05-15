import { gql } from '@apollo/client';

const GetStakingParams = gql`
  query GetStakingParams @api(name: forbole) {
    staking_params {
      params
    }
  }
`;

export default GetStakingParams;
