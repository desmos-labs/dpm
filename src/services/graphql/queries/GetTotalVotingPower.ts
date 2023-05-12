import { gql } from '@apollo/client';

const GetTotalVotingPower = gql`
  query GetTotalVotingPower @api(name: forbole) {
    validator_voting_power_aggregate {
      aggregate {
        sum {
          voting_power
        }
      }
    }
  }
`;

export default GetTotalVotingPower;
