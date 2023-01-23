import React, { useCallback } from 'react';
import { DesmosProfile } from 'types/desmos';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import ProfileImage from 'components/ProfileImage';
import useStyles from './useStyles';

export interface AccountProfilePicProps {
  profile: DesmosProfile | undefined;
}

const AccountProfilePic = (props: AccountProfilePicProps) => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const styles = useStyles();
  const { profile } = props;

  const openProfileDetails = useCallback(() => {
    navigation.navigate(ROUTES.PROFILE);
  }, [navigation]);

  return (
    <ProfileImage
      profile={profile}
      size={30}
      style={styles.avatarImage}
      onPress={openProfileDetails}
    />
  );
};

export default AccountProfilePic;
