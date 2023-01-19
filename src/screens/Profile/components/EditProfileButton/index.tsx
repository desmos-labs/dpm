import React, { useCallback } from 'react';
import { IconButton } from 'react-native-paper';
import { DesmosProfile } from 'types/desmos';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ROUTES from 'navigation/routes';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import useStyles from './useStyles';

export type EditProfileButtonProps = {
  profile: DesmosProfile | undefined;
};

const EditProfileButton = (props: EditProfileButtonProps) => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const styles = useStyles();
  const { profile } = props;

  const onEditProfile = useCallback(() => {
    navigation.navigate(ROUTES.EDIT_PROFILE, {
      profile,
    });
  }, [navigation, profile]);

  return <IconButton icon="edit" color={styles.button.color} onPress={onEditProfile} />;
};

export default EditProfileButton;
