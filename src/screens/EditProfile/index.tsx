import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { DesmosProfile } from 'types/desmos';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import ProfileHeader from 'components/ProfileHeader';
import Divider from 'components/Divider';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useProfileParams } from '@recoil/profileParams';
import { IconButton, useTheme } from 'react-native-paper';
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

  const { profile } = params;

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

  const { saveProfile } = useSaveProfile({ onSuccess: onSaveSuccess });

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

  const DoneButton = useMemo(
    () => (
      <IconButton
        style={styles.saveBtn}
        icon="check"
        color={canSave ? theme.colors.primary : theme.colors.disabled}
        onPress={onSavePressed}
        disabled={!canSave}
      />
    ),
    [canSave, onSavePressed, styles, theme],
  );

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
          title={profile !== null ? t('edit profile') : t('create profile')}
        />
      }
    >
      <ScrollView style={styles.content}>
        {/* Header */}
        <ProfileHeader
          canEdit={true}
          profile={profile}
          onEditCoverPicture={setCoverPicture}
          onEditProfilePicture={setProfilePicture}
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
          />
        </View>
      </ScrollView>
    </StyledSafeAreaView>
  );
};

export default EditProfile;
