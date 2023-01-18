import { gql } from '@apollo/client';

const GetConnectedApps = gql`
  query GetConnectedApps($address: String) @api(name: desmos) {
    application_link(where: { user_address: { _eq: $address } }) {
      application
      creation_time
      username
      state
      result
    }
  }
`;

export default GetConnectedApps;
