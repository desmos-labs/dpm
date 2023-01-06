import React, { useMemo } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import EditProfileButton from 'screens/Profile/components/EditProfileButton';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import useProfileDataQueries from 'screens/Profile/useProfileDataQueries';
import { useNavigation, useRoute } from '@react-navigation/native';
import ProfileData from 'screens/Profile/components/ProfileData';
import { useRecoilValue } from 'recoil';
import { activeAccountAppState } from '@recoil/activeAccountState';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.PROFILE>;

export interface ProfileAccountParams {
  visitingProfile?: string;
}

const Profile = () => {
  const navigation = useNavigation<NavProps['navigation']>();
  const { params } = useRoute<NavProps['route']>();
  const activeAccount = useRecoilValue(activeAccountAppState);
  const profileAddress = useMemo(() => {
    if (params?.visitingProfile !== undefined) {
      return params?.visitingProfile;
    }
    return activeAccount?.address!;
  }, [params?.visitingProfile, activeAccount]);

  const styles = useStyles();
  const theme = useTheme();

  const { profile, loadingProfile } = useProfileDataQueries(profileAddress);

  const ProfileTopBar = React.useMemo(
    () => (
      <TopBar
        style={styles.topBar}
        leftIconColor={theme.colors.icon['5']}
        stackProps={{ navigation }}
        rightElement={EditProfileBtn}
      />
    ),
    [navigation],
  );
  const EditProfileBtn = React.useMemo(() => <EditProfileButton profile={profile} />, [profile]);

  return (
    <StyledSafeAreaView padding={0} topBar={ProfileTopBar}>
      {loadingProfile ? <ActivityIndicator /> : <ProfileData profile={profile} />}
    </StyledSafeAreaView>
  );
};

export default Profile;
