import React, { useCallback } from 'react';
import DpmImage from 'components/DPMImage';
import { DPMImages } from 'types/images';
import Typography from 'components/Typography';
import Button from 'components/Button';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
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
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  const onCreateProfile = useCallback(() => {
    navigation.navigate(ROUTES.EDIT_PROFILE);
  }, [navigation]);

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
