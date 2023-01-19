import { gql } from '@apollo/client';

const GetAccountApplicationLinks = gql`
  query GetApplicationLinks($address: String) @api(name: desmos) {
    applicationLinks: application_link(where: { user_address: { _eq: $address } }) {
      application
      username
      creationTime: creation_time
      state
    }
  }
`;

export default GetAccountApplicationLinks;
