import {gql} from '@apollo/client';

const GetChainLinks = gql`
  query GetChainLinks($address: String) @api(name: desmos) {
    chain_link(where: {user_address: {_eq: $address}}) {
      user_address
      external_address
      chain_config {
        name
      }
      creation_time
    }
  }
`;

export default GetChainLinks;
