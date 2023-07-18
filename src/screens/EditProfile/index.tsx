import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { DesmosProfile } from 'types/desmos';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import ProfileHeader from 'components/ProfileHeader';
import Divider from 'components/Divider';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useProfileParams } from '@recoil/profileParams';
import { IconButton, useTheme } from 'react-native-paper';
import useShowModal from 'hooks/useShowModal';
import SingleButtonModal from 'modals/SingleButtonModal';
import { DPMImages } from 'types/images';
import { useSaveProfile, useValidationHooks } from './useHooks';
import InlineInput from './components/InlineInput';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.EDIT_PROFILE>;

export interface EditProfileParams {
  profile: DesmosProfile | undefined;
}

const EditProfile = () => {
  const styles = useStyles();
  const theme = useTheme();
  const navigation = useNavigation<NavProps['navigation']>();
  const { params } = useRoute<NavProps['route']>();
  const { t } = useTranslation('profile');

  const profile = params?.profile;

  const { params: profileParams, refetch: refetchProfileParams } = useProfileParams();
  const { validateDTag, validateNickname, validateBiography } = useValidationHooks(profileParams);

  const [dTag, setDTag] = useState<string | undefined>(profile?.dtag);
  const [dTagError, setDTagError] = useState<string | undefined>(undefined);
  const [nickname, setNickname] = useState<string | undefined>(profile?.nickname);
  const [nicknameError, setNicknameError] = useState<string | undefined>(undefined);
  const [biography, setBiography] = useState<string | undefined>(profile?.bio);
  const [biographyError, setBiographyError] = useState<string | undefined>(undefined);
  const [selectedProfilePicture, setProfilePicture] = useState<string | undefined>(undefined);
  const [selectedCoverPicture, setCoverPicture] = useState<string | undefined>(undefined);
  const showModal = useShowModal();

  const showErrorModal = useCallback(
    (title: string, message: string) => {
      showModal(SingleButtonModal, {
        title,
        message,
        image: DPMImages.Fail,
        actionLabel: t('cancel error'),
      });
    },
    [showModal, t],
  );

  const canSave = useMemo(
    () =>
      (dTag !== profile?.dtag ||
        nickname !== profile?.nickname ||
        biography !== profile?.bio ||
        selectedProfilePicture ||
        selectedCoverPicture) &&
      !dTagError &&
      !nicknameError,
    [
      profile,
      biography,
      dTag,
      dTagError,
      nickname,
      nicknameError,
      selectedCoverPicture,
      selectedProfilePicture,
    ],
  );

  React.useEffect(() => {
    // Get the profile params
    refetchProfileParams();
  }, [refetchProfileParams]);

  const onSaveSuccess = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const {
    preparing,
    saveProfile,
    coverPicUploading,
    coverPicUploadError,
    profilePicUploading,
    profilePicUploadError,
  } = useSaveProfile(React.useMemo(() => ({ onSuccess: onSaveSuccess }), [onSaveSuccess]));

  useEffect(() => {
    if (coverPicUploadError !== undefined) {
      showErrorModal(t('cover picture upload failed'), coverPicUploadError);
    } else if (profilePicUploadError !== undefined) {
      showErrorModal(t('profile picture upload failed'), profilePicUploadError);
    }
  }, [coverPicUploadError, profilePicUploadError, showErrorModal, t]);

  const onSavePressed = useCallback(async () => {
    await saveProfile(profile, {
      dTag,
      biography,
      nickname,
      profilePic: selectedProfilePicture,
      coverPic: selectedCoverPicture,
    });
  }, [
    biography,
    dTag,
    nickname,
    profile,
    saveProfile,
    selectedCoverPicture,
    selectedProfilePicture,
  ]);

  const DoneButton = useMemo(() => {
    const enabled = canSave && !preparing;
    return (
      <IconButton
        style={styles.saveBtn}
        icon="check"
        color={enabled ? theme.colors.primary : theme.colors.disabled}
        onPress={onSavePressed}
        disabled={!enabled}
      />
    );
  }, [preparing, canSave, onSavePressed, styles, theme]);

  const onDTagChanged = useCallback(
    (newDTag: string) => {
      setDTag(newDTag);
      setDTagError(validateDTag(newDTag));
    },
    [validateDTag],
  );

  const onNicknameChanged = useCallback(
    (changedNickname: string) => {
      if (changedNickname.length === 0) {
        setNickname('');
        setNicknameError(undefined);
      } else {
        setNickname(changedNickname);
        setNicknameError(validateNickname(changedNickname));
      }
    },
    [validateNickname],
  );

  const onBiographyChanged = useCallback(
    (changedBiography: string) => {
      if (changedBiography.length === 0) {
        setBiography('');
        setBiographyError(undefined);
      } else {
        setBiography(changedBiography);
        setBiographyError(validateBiography(changedBiography));
      }
    },
    [validateBiography],
  );

  return (
    <StyledSafeAreaView
      padding={0}
      topBar={
        <TopBar
          stackProps={{ navigation }}
          rightElement={DoneButton}
          title={profile ? t('edit profile') : t('create profile')}
        />
      }
      touchableWithoutFeedbackDisabled={false}
    >
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
        style={{ flex: 1 }}
        {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
      >
        <ScrollView style={styles.content} keyboardDismissMode={'on-drag'}>
          {/* Header */}
          <ProfileHeader
            canEdit={true}
            profile={profile}
            onEditCoverPicture={setCoverPicture}
            coverPictureUploading={coverPicUploading}
            onEditProfilePicture={setProfilePicture}
            profilePictureUploading={profilePicUploading}
          />

          <View style={styles.input}>
            {/* Nickname */}
            <InlineInput
              label={t('nickname')}
              placeholder={t('nickname')}
              value={nickname}
              onChangeText={onNicknameChanged}
              error={nicknameError}
            />

            <Divider />

            {/* DTag */}
            <InlineInput
              label={t('dtag')}
              placeholder={t('dtag')}
              value={dTag}
              error={dTagError}
              onChangeText={onDTagChanged}
            />

            <Divider />

            {/* Biography */}
            <InlineInput
              style={styles.bioEditor}
              label={t('bio')}
              placeholder={t('bio')}
              value={biography}
              error={biographyError}
              onChangeText={onBiographyChanged}
              numberOfLines={5}
              multiline={true}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};

export default EditProfile;
