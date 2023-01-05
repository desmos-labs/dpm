import React, { ReactNode, useMemo } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from 'react-native-paper';
import AvatarImage from 'components/AvatarImage';
import IconButton from 'components/IconButton';
import Typography from 'components/Typography';
import { DesmosProfile } from 'types/desmosTypes';
import { defaultProfileCover, defaultProfilePicture } from 'assets/images';
import useStyles from './useStyles';

export type ProfileHeaderProps = {
  profile: DesmosProfile | undefined;
  topRightElement?: ReactNode | null;
  topLeftElement?: ReactNode | null;
  onCopyPressed?: () => void;
  onEditProfilePicture?: () => void;
  onEditCoverPicture?: () => void;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = (props) => {
  const {
    profile,
    topRightElement,
    topLeftElement,
    onCopyPressed,
    onEditProfilePicture,
    onEditCoverPicture,
  } = props;
  const theme = useTheme();
  const styles = useStyles();

  const memoizedPictureSource = (url: string | undefined, picture: any) =>
    useMemo(() => (url ? { uri: url } : picture), [url, picture]);

  const coverPicture = memoizedPictureSource(profile?.coverPicture, defaultProfileCover);
  const profilePicture = memoizedPictureSource(profile?.profilePicture, defaultProfilePicture);

  return (
    <View style={styles.root}>
      <View style={styles.topRight}>{topRightElement}</View>
      <View style={styles.topLeft}>{topLeftElement}</View>
      <View style={styles.coverPictureContainer}>
        <FastImage style={styles.coverPicture} resizeMode="cover" source={coverPicture} />
        {onEditCoverPicture && (
          <IconButton
            icon="camera"
            size={20}
            color={theme.colors.icon['5']}
            onPress={onEditCoverPicture}
            style={styles.editCoverPictureBtn}
          />
        )}
      </View>
      <View style={styles.profilePictureContainer}>
        <AvatarImage size={100} source={profilePicture} />
        {onEditProfilePicture && (
          <IconButton
            icon="camera"
            size={20}
            color={theme.colors.icon['5']}
            onPress={onEditProfilePicture}
            style={styles.editProfilePictureBtn}
          />
        )}
      </View>

      {profile?.nickname && (
        <Typography.H4 style={styles.nickName}>{profile.nickname}</Typography.H4>
      )}

      {profile?.dtag && <Typography.Body style={styles.dtag}>@{profile.dtag}</Typography.Body>}

      {profile?.address && (
        <View style={styles.addressContainer}>
          <Typography.Caption ellipsizeMode="middle" numberOfLines={1}>
            {profile.address}
          </Typography.Caption>
          <View>
            <IconButton icon="content-copy" size={20} onPress={onCopyPressed} color="#c4c4c4" />
          </View>
        </View>
      )}
    </View>
  );
};

export default ProfileHeader;
