import React, { useCallback } from 'react';
import DpmImage from 'components/DPMImage';
import { DPMImages } from 'types/images';
import Typography from 'components/Typography';
import Button from 'components/Button';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import useStyles from './useStyles';

const NonExistingProfile = () => {
  const styles = useStyles();
  const { t } = useTranslation();

  const onCreateProfile = useCallback(() => {
    // navigation.navigate({
    //   name: 'EditProfile',
    //   params: {
    //     account,
    //     profile: null,
    //   },
    // });
  }, []);

  return (
    <View style={styles.root}>
      <DpmImage style={styles.noProfileImage} source={DPMImages.NoProfile} resizeMode="contain" />
      <Typography.Body1>{t('create first desmos profile')}</Typography.Body1>
      <Button style={styles.createProfileButton} mode="outlined" onPress={onCreateProfile}>
        {t('create profile')}
      </Button>
    </View>
  );
};

export default NonExistingProfile;
