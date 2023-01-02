import {gql} from '@apollo/client';

const GetProfileForAddress = gql`
  query GetProfileForAddress($address: String) @api(name: desmos) {
    profile(where: {address: {_eq: $address}}) {
      address
      bio
      dtag
      creation_time
      cover_pic
      nickname
      profile_pic
      followage {
        counterparty_address
        subspace_id
      }
      following {
        counterparty_address
        subspace_id
      }
    }
  }
`;

export default GetProfileForAddress;
