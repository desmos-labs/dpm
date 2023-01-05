import { gql } from '@apollo/client';
import PROFILE_FIELDS from './fragments/ProfilesFields';

const GetProfileForAddress = gql`
  ${PROFILE_FIELDS}
  query GetProfileForAddress($address: String) @api(name: desmos) {
    profile(where: { address: { _eq: $address } }) {
      ...ProfileFields
    }
  }
`;

export default GetProfileForAddress;
