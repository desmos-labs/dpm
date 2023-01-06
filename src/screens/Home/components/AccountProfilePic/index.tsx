import React, { useCallback, useMemo } from 'react';
import { DesmosProfile } from 'types/desmosTypes';
import AvatarImage from 'components/AvatarImage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { defaultProfilePicture } from 'assets/images';
import useStyles from './useStyles';

export interface AccountProfilePicProps {
  profile: DesmosProfile | undefined;
}

const AccountProfilePic = (props: AccountProfilePicProps) => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const styles = useStyles();
  const { profile } = props;

  const openProfileDetails = useCallback(() => {
    navigation.navigate(ROUTES.PROFILE, {});
  }, [navigation]);

  const imageSource = useMemo(
    () => (profile?.profilePicture ? { uri: profile?.profilePicture } : defaultProfilePicture),
    [profile],
  );

  return (
    <AvatarImage
      size={30}
      style={styles.avatarImage}
      source={imageSource}
      onPress={openProfileDetails}
    />
  );
};

export default AccountProfilePic;
