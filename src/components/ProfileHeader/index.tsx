import React, { ReactNode, useCallback, useState } from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from 'react-native-paper';
import AvatarImage from 'components/AvatarImage';
import IconButton from 'components/IconButton';
import Typography from 'components/Typography';
import { DesmosProfile } from 'types/desmos';
import { defaultProfileCover, defaultProfilePicture } from 'assets/images';
import CopyButton from 'components/CopyButton';
import { Circle, Rect } from 'react-content-loader/native';
import ThemedContentLoader from 'components/ThemedContentLoader';
import Spacer from 'components/Spacer';
import TypographyContentLoaders from 'components/ContentLoaders/Typography';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import { Validator } from 'types/validator';
import { usePickPicture, useMemoizedPictureSource } from './useHooks';
import useStyles from './useStyles';

export type ProfileHeaderProps = {
  /**
   * The profile to display.
   */
  profile: DesmosProfile | undefined;
  /**
   * If defined this component will show the validator's information
   * if the `profile` prop is undefined.
   */
  validator?: Validator;
  /**
   * If true the component will show some animations
   * to inform the user that the profile is being fetched.
   */
  loading?: boolean;
  canEdit?: boolean;
  topRightElement?: ReactNode | null;
  topLeftElement?: ReactNode | null;
  onEditCoverPicture?: (uri: string) => void;
  coverPictureUploading?: boolean;
  onEditProfilePicture?: (uri: string) => void;
  profilePictureUploading?: boolean;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = (props) => {
  const {
    profile,
    validator,
    loading,
    canEdit,
    topRightElement,
    topLeftElement,
    onEditProfilePicture,
    coverPictureUploading,
    onEditCoverPicture,
    profilePictureUploading,
  } = props;
  const theme = useTheme();
  const styles = useStyles(props);

  const pickPicture = usePickPicture();

  const [coverPicSrc, setCoverPicSrc] = useState<string | undefined>(profile?.coverPicture);
  const [profilePicSrc, setProfilePicSrc] = useState<string | undefined>(profile?.profilePicture);

  // -------- VARIABLES --------

  const coverPicture = useMemoizedPictureSource(coverPicSrc, defaultProfileCover);
  const profilePicture = useMemoizedPictureSource(profilePicSrc, defaultProfilePicture);
  const dtag = React.useMemo(() => (loading ? undefined : profile?.dtag), [loading, profile?.dtag]);
  const nickname = React.useMemo(() => {
    if (loading) {
      return undefined;
    }

    return profile?.nickname ?? validator?.moniker;
  }, [loading, profile?.nickname, validator?.moniker]);
  const address = React.useMemo(() => {
    if (loading) {
      return undefined;
    }

    // We return first the validator address becouse if both validator and
    // profile are defined means that we are displaying a validator's profile
    // and in this case we want to display the validator's operator address.
    return validator?.operatorAddress ?? profile?.address;
  }, [loading, validator?.operatorAddress, profile?.address]);

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

  // Effect to update the profile and cover picture when they change.
  React.useEffect(() => {
    setCoverPicSrc(profile?.coverPicture);
    setProfilePicSrc(profile?.profilePicture ?? validator?.avatarUrl);
  }, [profile?.coverPicture, profile?.profilePicture, validator?.avatarUrl]);

  return (
    <View style={styles.root}>
      <View style={styles.topRight}>{topRightElement}</View>
      <View style={styles.topLeft}>{topLeftElement}</View>

      {/* Cover picture */}
      <View style={styles.coverPictureContainer}>
        {loading === true ? (
          <ThemedContentLoader style={styles.coverPicture}>
            <Rect width="100%" height="100%" />
          </ThemedContentLoader>
        ) : (
          <FastImage style={styles.coverPicture} resizeMode="cover" source={coverPicture} />
        )}
        {coverPictureUploading === true && (
          <StyledActivityIndicator style={styles.coverPictureActivityIndicator} />
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
          {loading === true ? (
            <ThemedContentLoader width="100%" height="100%">
              <Circle r="50%" cx="50%" cy="50%" />
            </ThemedContentLoader>
          ) : (
            <AvatarImage size={100} source={profilePicture} loading={profilePictureUploading} />
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
          nickname && <Typography.Body style={styles.nickName}>{nickname}</Typography.Body>
        )}

        {/* DTag */}
        {loading ? (
          <TypographyContentLoaders.Caption width={120} />
        ) : (
          dtag && <Typography.Caption>@{dtag}</Typography.Caption>
        )}

        {/* Address */}
        {loading ? (
          <ThemedContentLoader width="150" height="36">
            <Rect width="100%" height="16" y="10" />
          </ThemedContentLoader>
        ) : (
          address && (
            <View style={styles.addressContainer}>
              <Typography.Caption ellipsizeMode="middle" numberOfLines={1}>
                {address}
              </Typography.Caption>
              <CopyButton value={address} color="#c4c4c4" />
            </View>
          )
        )}
      </View>
    </View>
  );
};

export default ProfileHeader;
