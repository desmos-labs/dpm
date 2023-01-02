import {gql} from '@apollo/client';

const GetProfileForAddresses = gql`
  query GetProfileForAddress($addresses: [String]) @api(name: desmos) {
    profile(where: {address: {_in: $addresses}}) {
      address
      bio
      dtag
      creation_time
      cover_pic
      nickname
      profile_pic
    }
  }
`;

export default GetProfileForAddresses;
