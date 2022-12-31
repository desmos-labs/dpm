import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { ImagePickerResponse } from 'react-native-image-picker/src/types';
import { makeStyle } from 'theming';
import { DesmosProfile } from 'types/desmos';
import { AccountScreensStackParams, RootStackParams } from 'types/navigation';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import ProfileHeader from 'components/ProfileHeader';
import Divider from 'components/Divider';
import Button from 'components/Button';
import useProfileValidators from 'hooks/useProfileValidators';
import InlineLabeledValue from './components/InlineLabeledValue';
import InlineInput from './components/InlineInput';
import useStyles from './useStyles';

type Props = CompositeScreenProps<
  StackScreenProps<AccountScreensStackParams, 'EditProfile'>,
  StackScreenProps<RootStackParams>
>;

const EditProfile: React.FC<Props> = (props) => {
  const {
    navigation,
    route: {
      params: { account, profile, bio, goBackTo, feeGranter },
    },
  } = props;
  const styles = useStyles();
  const { t } = useTranslation();
  const [dtag, setDtag] = useState(profile?.dtag ?? '');
  const [dtagError, setDtagError] = useState<string | undefined>(undefined);
  const [nickname, setNickname] = useState(profile?.nickname);
  const [nicknameError, setNicknameError] = useState<string | undefined>(undefined);
  const [biography, setBiography] = useState(profile?.bio);
  const [selectedProfilePicture, setProfilePicture] = useState<string | undefined>(undefined);
  const [selectedCoverPicture, setCoverPicture] = useState<string | undefined>(undefined);
  const { validateDtag, validateNickname } = useProfileValidators();

  useEffect(() => {
    if (bio === null || bio !== undefined) {
      setBiography(bio === null ? undefined : bio);
    }
  }, [bio]);

  const onSavePressed = () => {
    if (account) {
      navigation.navigate({
        name: 'ConfirmProfileEdit',
        params: {
          account,
          oldProfile: {
            ...profile,
          },
          profile: {
            ...profile,
            address: account.address,
            dtag,
            nickname,
            bio: biography,
          } as DesmosProfile,
          localCoverPictureUri: selectedCoverPicture,
          localProfilePictureUri: selectedProfilePicture,
          goBackTo,
          feeGranter,
        },
      });
    }
  };

  const pickPicture = useCallback((setter: (value: string | undefined) => void) => {
    launchImageLibrary(
      {
        quality: 1,
        mediaType: 'photo',
        selectionLimit: 1,
        includeBase64: false,
      },
      (response: ImagePickerResponse) => {
        const assets = response.assets ?? [];
        if (assets.length > 0) {
          setter(assets[0].uri);
        }
      },
    );
  }, []);

  const onEditCoverPicture = useCallback(() => {
    pickPicture(setCoverPicture);
  }, [pickPicture]);

  const onEditProfilePicture = useCallback(() => {
    pickPicture(setProfilePicture);
  }, [pickPicture]);

  const openBiographyEditor = useCallback(() => {
    navigation.navigate({
      name: 'BiographyEditor',
      params: {
        bio: biography,
      },
    });
  }, [biography, navigation]);

  const dtagChanged = useCallback(
    (changedDtag: string) => {
      setDtagError(validateDtag(changedDtag));
      setDtag(changedDtag);
    },
    [validateDtag],
  );

  const nicknameChanged = useCallback(
    (changedNickname: string) => {
      if (changedNickname.length === 0) {
        setNicknameError(undefined);
        setNickname(undefined);
      } else {
        setNicknameError(validateNickname(changedNickname));
        setNickname(changedNickname);
      }
    },
    [validateNickname],
  );

  return (
    <StyledSafeAreaView
      padding={0}
      topBar={
        <TopBar
          stackProps={props}
          title={profile !== null ? t('edit profile') : t('create profile')}
        />
      }
    >
      <ProfileHeader
        coverPictureUri={selectedCoverPicture ?? profile?.coverPicture}
        profilePictureUri={selectedProfilePicture ?? profile?.profilePicture}
        onEditCoverPicture={onEditCoverPicture}
        onEditProfilePicture={onEditProfilePicture}
      />
      <ScrollView style={styles.content}>
        <InlineInput
          label={t('nickname')}
          placeholder={t('nickname')}
          value={nickname}
          onChangeText={nicknameChanged}
          error={nicknameError}
        />
        <Divider />
        <InlineInput
          label="DTag"
          placeholder="DTag"
          value={dtag}
          error={dtagError}
          onChangeText={dtagChanged}
        />
        <Divider />
        <InlineLabeledValue label={t('bio')} value={biography} onPress={openBiographyEditor} />
      </ScrollView>
      <Button
        style={styles.saveBtn}
        mode="contained"
        onPress={onSavePressed}
        disabled={dtag.length === 0 || dtagError !== undefined || nicknameError !== undefined}
      >
        {t('next')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default EditProfile;
