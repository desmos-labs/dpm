import React, { useMemo } from 'react';
import { DesmosProfile } from 'types/desmos';
import AvatarImageProps from 'components/AvatarImage/props';
import AvatarImage from 'components/AvatarImage';
import { defaultProfilePicture } from 'assets/images';

export interface ProfileImageProps extends Omit<AvatarImageProps, 'source'> {
  readonly profile: DesmosProfile | undefined;
}

const ProfileImage = (props: ProfileImageProps) => {
  const { profile, ...rest } = props;

  const profileImage = useMemo(
    () => (profile?.profilePicture ? { uri: profile.profilePicture } : defaultProfilePicture),
    [profile],
  );

  return <AvatarImage source={profileImage} {...rest} />;
};

export default ProfileImage;
