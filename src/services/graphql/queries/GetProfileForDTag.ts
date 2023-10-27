import { gql } from '@apollo/client';
import PROFILE_FIELDS from './fragments/ProfilesFields';

const GetProfileForDTag = gql`
  ${PROFILE_FIELDS}
  query GetProfileForAddress($dtag: String) @api(name: desmos) {
    profile(where: { dtag: { _eq: $dtag } }) {
      ...ProfileFields
    }
  }
`;

export default GetProfileForDTag;
