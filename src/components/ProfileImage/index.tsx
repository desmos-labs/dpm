import React, { useMemo } from 'react';
import { DesmosProfile } from 'types/desmos';
import AvatarImageProps from 'components/AvatarImage/props';
import AvatarImage from 'components/AvatarImage';
import { defaultProfilePicture } from 'assets/images';

export interface ProfileImageProps extends Omit<AvatarImageProps, 'source'> {
  readonly profile: DesmosProfile | undefined;
  /**
   * True if we should display an activity indicator over the profile image.
   */
  readonly loading?: boolean;
}

const ProfileImage = (props: ProfileImageProps) => {
  const { profile, loading, ...rest } = props;

  const profileImage = useMemo(
    () => (profile?.profilePicture ? { uri: profile.profilePicture } : defaultProfilePicture),
    [profile],
  );

  return <AvatarImage source={profileImage} {...rest} loading={loading} />;
};

export default ProfileImage;
