import { gql } from '@apollo/client';

const GetAccountChainLinks = gql`
  query GetChainLinks($address: String) @api(name: desmos) {
    chainLinks: chain_link(
      where: { user_address: { _eq: $address }, proof: {} }
      order_by: { chain_config: { name: asc } }
    ) {
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

export default GetAccountChainLinks;
