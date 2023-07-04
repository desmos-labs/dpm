import React, { useMemo } from 'react';
import { DesmosProfile } from 'types/desmos';
import AvatarImage, { AvatarImageProps } from 'components/AvatarImage';
import { defaultProfilePicture } from 'assets/images';
import { Source } from 'react-native-fast-image';

export interface ProfileImageProps extends Omit<AvatarImageProps, 'source'> {
  readonly profile: DesmosProfile | undefined;
  /**
   * If defined use this provided image as fallback if the profile
   * don't have a profile picture.
   */
  readonly overrideDefaultProfilePicture?: Source;
  /**
   * True if we should display an activity indicator over the profile image.
   */
  readonly loading?: boolean;
}

const ProfileImage = (props: ProfileImageProps) => {
  const { profile, loading, overrideDefaultProfilePicture, ...rest } = props;

  const profileImage = useMemo(
    () =>
      profile?.profilePicture
        ? { uri: profile.profilePicture }
        : overrideDefaultProfilePicture ?? defaultProfilePicture,
    [overrideDefaultProfilePicture, profile],
  );

  return <AvatarImage source={profileImage} {...rest} loading={loading} />;
};

export default ProfileImage;
