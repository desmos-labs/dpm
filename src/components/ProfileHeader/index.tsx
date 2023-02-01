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
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import Spacer from 'components/Spacer';
import TypographyContentLoaders from 'components/ContentLoaders/Typography';
import useStyles from './useStyles';

export type ProfileHeaderProps = {
  profile: DesmosProfile | undefined;
  loading?: boolean;
  canEdit?: boolean;
  topRightElement?: ReactNode | null;
  topLeftElement?: ReactNode | null;
  onEditCoverPicture?: (uri: string) => void;
  coverPictureLoading?: boolean;
  onEditProfilePicture?: (uri: string) => void;
  profilePictureLoading?: boolean;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = (props) => {
  const {
    profile,
    loading,
    canEdit,
    topRightElement,
    topLeftElement,
    onEditProfilePicture,
    coverPictureLoading,
    onEditCoverPicture,
    profilePictureLoading,
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
        {coverPictureLoading === true || loading === true ? (
          <ContentLoader style={styles.coverPicture}>
            <Rect width="100%" height="100%" />
          </ContentLoader>
        ) : (
          <FastImage style={styles.coverPicture} resizeMode="cover" source={coverPicture} />
        )}
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

      <View style={styles.profileDataContainer}>
        {/* Profile picture */}
        <View style={styles.profilePictureContainer}>
          {profilePictureLoading === true || loading === true ? (
            <ContentLoader width="100%" height="100%">
              <Circle r="50%" cx="50%" cy="50%" />
            </ContentLoader>
          ) : (
            <AvatarImage size={100} source={profilePicture} />
          )}
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
        <Spacer paddingTop={16} />
        {loading ? (
          <TypographyContentLoaders.Body width={200} />
        ) : (
          profile?.nickname && (
            <Typography.Body style={styles.nickName}>{profile.nickname}</Typography.Body>
          )
        )}

        {/* DTag */}
        {loading ? (
          <TypographyContentLoaders.Caption width={120} />
        ) : (
          profile?.dtag && <Typography.Caption>@{profile.dtag}</Typography.Caption>
        )}

        {/* Address */}
        {loading ? (
          <ContentLoader width="150" height="36">
            <Rect width="100%" height="16" y="10" />
          </ContentLoader>
        ) : (
          profile?.address && (
            <View style={styles.addressContainer}>
              <Typography.Caption ellipsizeMode="middle" numberOfLines={1}>
                {profile.address}
              </Typography.Caption>
              <CopyButton value={profile.address} color="#c4c4c4" />
            </View>
          )
        )}
      </View>
    </View>
  );
};

export default ProfileHeader;
