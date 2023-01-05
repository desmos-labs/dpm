import { gql } from '@apollo/client';

const ProfileFields = gql`
  fragment ProfileFields on profile {
    address
    bio
    dtag
    creationTime: creation_time
    coverPicture: cover_pic
    nickname
    profilePicture: profile_pic
  }
`;

export default ProfileFields;
