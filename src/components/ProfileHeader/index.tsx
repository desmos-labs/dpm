import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from 'react-native-paper';
import AvatarImage from 'components/AvatarImage';
import IconButton from 'components/IconButton';
import Typography from 'components/Typography';
import { DesmosProfile } from 'types/desmos';
import { defaultProfileCover, defaultProfilePicture } from 'assets/images';
import CopyButton from 'components/CopyButton';
import usePickPicture from 'components/ProfileHeader/useHooks';
import useStyles from './useStyles';

export type ProfileHeaderProps = {
  profile: DesmosProfile | undefined;
  canEdit?: boolean;
  topRightElement?: ReactNode | null;
  topLeftElement?: ReactNode | null;
  onEditCoverPicture?: (uri: string) => void;
  onEditProfilePicture?: (uri: string) => void;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = (props) => {
  const {
    profile,
    canEdit,
    topRightElement,
    topLeftElement,
    onEditProfilePicture,
    onEditCoverPicture,
  } = props;
  const theme = useTheme();
  const styles = useStyles();

  const pickPicture = usePickPicture();

  const useMemoizedPictureSource = (url: string | undefined, picture: any) =>
    useMemo(() => (url ? { uri: url } : picture), [url, picture]);

  const [coverPicSrc, setCoverPicSrc] = useState<string | undefined>(profile?.coverPicture);
  const [profilePicSrc, setProfilePicSrc] = useState<string | undefined>(profile?.profilePicture);

  const coverPicture = useMemoizedPictureSource(coverPicSrc, defaultProfileCover);
  const profilePicture = useMemoizedPictureSource(profilePicSrc, defaultProfilePicture);

  const pickCoverPicture = useCallback(() => {
    pickPicture((imageUri: string | undefined) => {
      if (!imageUri) return;
      setCoverPicSrc(imageUri);
      if (onEditCoverPicture) {
        onEditCoverPicture(imageUri);
      }
    });
  }, [onEditCoverPicture, pickPicture]);

  const pickProfilePicture = useCallback(() => {
    pickPicture((imageUri: string | undefined) => {
      if (!imageUri) return;
      setProfilePicSrc(imageUri);
      if (onEditProfilePicture) {
        onEditProfilePicture(imageUri);
      }
    });
  }, [onEditProfilePicture, pickPicture]);

  return (
    <View style={styles.root}>
      <View style={styles.topRight}>{topRightElement}</View>
      <View style={styles.topLeft}>{topLeftElement}</View>

      {/* Cover picture */}
      <View style={styles.coverPictureContainer}>
        <FastImage style={styles.coverPicture} resizeMode="cover" source={coverPicture} />
        {canEdit && (
          <IconButton
            icon="camera"
            size={20}
            color={theme.colors.icon['5']}
            onPress={pickCoverPicture}
            style={styles.editCoverPictureBtn}
          />
        )}
      </View>

      {/* Profile picture */}
      <View style={styles.profilePictureContainer}>
        <AvatarImage size={100} source={profilePicture} />
        {canEdit && (
          <IconButton
            icon="camera"
            size={20}
            color={theme.colors.icon['5']}
            onPress={pickProfilePicture}
            style={styles.editProfilePictureBtn}
          />
        )}
      </View>

      {/* Nickname */}
      {profile?.nickname && (
        <Typography.H4 style={styles.nickName}>{profile.nickname}</Typography.H4>
      )}

      {/* DTag */}
      {profile?.dtag && <Typography.Body style={styles.dtag}>@{profile.dtag}</Typography.Body>}

      {/* Address */}
      {profile?.address && (
        <View style={styles.addressContainer}>
          <Typography.Caption ellipsizeMode="middle" numberOfLines={1}>
            {profile.address}
          </Typography.Caption>
          <CopyButton value={profile.address} color="#c4c4c4" />
        </View>
      )}
    </View>
  );
};

export default ProfileHeader;
