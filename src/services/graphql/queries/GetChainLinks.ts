import { gql } from '@apollo/client';

const GetChainLinks = gql`
  query GetChainLinks($address: String) @api(name: desmos) {
    chainLinks: chain_link(where: { user_address: { _eq: $address }, proof: {} }) {
      userAddress: user_address
      externalAddress: external_address
      chainConfig: chain_config {
        name
      }
      proof {
        plainText: plain_text
        signature
      }
      creationTime: creation_time
    }
  }
`;

export default GetChainLinks;
