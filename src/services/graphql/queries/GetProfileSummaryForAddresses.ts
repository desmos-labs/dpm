import { gql } from '@apollo/client';

const GetProfileSummaryForAddresses = gql`
  query GetProfileSummaryForAddresses($addresses: [String]) @api(name: desmos) {
    profile(where: { address: { _in: $addresses } }) {
      address
      dtag
      profile_pic
      nickname
    }
  }
`;

export default GetProfileSummaryForAddresses;
