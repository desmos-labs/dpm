import React, { useCallback } from 'react';
import { DesmosProfile } from 'types/desmos';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ROUTES from 'navigation/routes';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import IconButton, { IconButtonProps } from 'components/IconButton';

export type EditProfileButtonProps = {
  profile: DesmosProfile | undefined;
  style?: IconButtonProps['style'];
};

const EditProfileButton = (props: EditProfileButtonProps) => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const { profile, style } = props;

  const onEditProfile = useCallback(() => {
    navigation.navigate(ROUTES.EDIT_PROFILE, {
      profile,
    });
  }, [navigation, profile]);

  return <IconButton size={28} icon="edit" style={style} onPress={onEditProfile} />;
};

export default EditProfileButton;
