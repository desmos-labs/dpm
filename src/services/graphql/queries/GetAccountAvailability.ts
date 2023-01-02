import {gql} from '@apollo/client';

const GetAccountAvailability = gql`
  query AccountAvailability($userAddress: String) @api(name: desmos) {
    profile(where: {address: {_eq: $userAddress}}) {
      address
    }
  }
`;

export default GetAccountAvailability;
