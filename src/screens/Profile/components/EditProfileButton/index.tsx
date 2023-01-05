import React, { useCallback } from 'react';
import { IconButton } from 'react-native-paper';
import { DesmosProfile } from 'types/desmosTypes';
import { useNavigation } from '@react-navigation/native';
import useStyles from './useStyles';

export type EditProfileButtonProps = {
  profile: DesmosProfile | undefined;
};

const EditProfileButton = (props: EditProfileButtonProps) => {
  const navigation = useNavigation();
  const styles = useStyles();
  const { profile } = props;

  const onEditProfile = useCallback(() => {
    // TODO: Re-implement
    // navigation.navigate({
    //   name: 'EditProfile',
    //   params: {
    //     account,
    //     profile,
    //   },
    // });
  }, [profile]);

  return <IconButton icon="edit" color={styles.button.color} onPress={onEditProfile} />;
};

export default EditProfileButton;
