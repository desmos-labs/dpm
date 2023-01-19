import { gql } from '@apollo/client';
import PROFILE_FIELDS from './fragments/ProfilesFields';

const GetProfileForAddresses = gql`
  ${PROFILE_FIELDS}
  query GetProfileForAddress($addresses: [String]) @api(name: desmos) {
    profile(where: { address: { _in: $addresses } }) {
      ...ProfileFields
    }
  }
`;

export default GetProfileForAddresses;
