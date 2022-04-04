import React, { ReactNode, useMemo } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from 'react-native-paper';
import { makeStyle } from '../theming';
import { AvatarImage } from './AvatarImage';
import IconButton from './IconButton';
import { Typography } from './typography';

export type Props = {
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

export const ProfileHeader: React.FC<Props> = (props) => {
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
        : require('../assets/default-profile-cover-light.png'),
    [coverPictureUri]
  );

  const profilePicture = useMemo(
    () =>
      profilePictureUri
        ? {
            uri: profilePictureUri,
          }
        : require('../assets/default-profile-picture.png'),
    [profilePictureUri]
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

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
  topRight: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    right: 0,
  },
  topLeft: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
  },
  coverPictureContainer: {
    width: '100%',
  },
  coverPicture: {
    width: '100%',
    height: 200,
  },
  editCoverPictureBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 2,
  },
  profilePictureContainer: {
    marginTop: -70,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editProfilePictureBtn: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 2,
  },
  nickName: {
    fontWeight: '500',
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: 0.0015,
    color: theme.colors.primary,
    marginTop: 16,
  },
  dtag: {
    marginTop: 6,
  },
  addressContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 16,
    marginHorizontal: 32,
    alignItems: 'center',
  },
}));
