import React, { ReactNode, useMemo } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from 'react-native-paper';
import AvatarImage from 'components/AvatarImage';
import IconButton from 'components/IconButton';
import Typography from 'components/Typography';
import useStyles from './useStyles';

export type ProfileHeaderProps = {
  address?: string;
  dtag?: string;
  nickname?: string;
  coverPictureUri?: string;
  profilePictureUri?: string;
  topRightElement?: ReactNode | null;
  topLeftElement?: ReactNode | null;
  onCopyPressed?: () => void;
  onEditProfilePicture?: () => void;
  onEditCoverPicture?: () => void;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = (props) => {
  const {
    address,
    dtag,
    nickname,
    coverPictureUri,
    profilePictureUri,
    topRightElement,
    topLeftElement,
    onCopyPressed,
    onEditProfilePicture,
    onEditCoverPicture,
  } = props;
  const theme = useTheme();
  const styles = useStyles();

  const coverPicture = useMemo(
    () =>
      coverPictureUri
        ? {
            uri: coverPictureUri,
          }
        : require('assets/default-profile-cover-light.png'),
    [coverPictureUri],
  );

  const profilePicture = useMemo(
    () =>
      profilePictureUri
        ? {
            uri: profilePictureUri,
          }
        : require('assets/default-profile-picture.png'),
    [profilePictureUri],
  );

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

      {nickname !== undefined && <Typography.H4 style={styles.nickName}>{nickname}</Typography.H4>}

      {dtag !== undefined && <Typography.Body style={styles.dtag}>@{dtag}</Typography.Body>}

      {address && (
        <View style={styles.addressContainer}>
          <Typography.Body ellipsizeMode="middle" numberOfLines={1}>
            {address}
          </Typography.Body>
          <View>
            <IconButton icon="content-copy" size={20} onPress={onCopyPressed} color="#c4c4c4" />
          </View>
        </View>
      )}
    </View>
  );
};

export default ProfileHeader;
