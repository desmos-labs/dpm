import React, { useCallback } from 'react';
import DpmImage from 'components/DPMImage';
import { DPMImages } from 'types/images';
import Typography from 'components/Typography';
import Button from 'components/Button';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import useStyles from './useStyles';

export interface NonExitingProfileProps {
  /**
   * Tells whether the non exiting profile can be created by the current app user, or not.
   */
  canCreate: boolean;
}

const NonExistingProfile = (props: NonExitingProfileProps) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { canCreate } = props;

  const onCreateProfile = useCallback(() => {
    // TODO: Implement this
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
      <Typography.Body1>
        {canCreate ? t('create first desmos profile') : t('user does not have profile')}
      </Typography.Body1>
      {canCreate && (
        <Button style={styles.createProfileButton} mode="outlined" onPress={onCreateProfile}>
          {t('create profile')}
        </Button>
      )}
    </View>
  );
};

export default NonExistingProfile;
