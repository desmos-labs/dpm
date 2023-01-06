import React, { useMemo } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import useProfileDataQueries from 'screens/Profile/useProfileDataQueries';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRecoilValue } from 'recoil';
import { activeAccountAppState } from '@recoil/activeAccountState';
import EditProfileButton from 'screens/Profile/components/EditProfileButton';
import ProfileData from './components/ProfileData';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.PROFILE>;

export interface ProfileParams {
  /**
   * Address of the profile that the user is visiting.
   * If no address is provided, this screen will load the current user profile data instead.
   */
  visitingProfile?: string;
}

const Profile = () => {
  const navigation = useNavigation<NavProps['navigation']>();
  const { params } = useRoute<NavProps['route']>();
  const styles = useStyles();
  const theme = useTheme();

  const visitingProfile = params?.visitingProfile;
  const activeAccount = useRecoilValue(activeAccountAppState);
  const profileAddress = useMemo(() => {
    if (visitingProfile) {
      return visitingProfile;
    }
    return activeAccount?.address!;
  }, [visitingProfile, activeAccount]);
  const canEdit = useMemo(() => !visitingProfile, [visitingProfile]);

  const { profile, loadingProfile } = useProfileDataQueries(profileAddress);

  const EditProfileBtn = React.useMemo(
    () => (canEdit ? <EditProfileButton profile={profile} /> : undefined),
    [profile, canEdit],
  );

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

  return (
    <StyledSafeAreaView padding={0} topBar={ProfileTopBar}>
      {loadingProfile ? (
        <ActivityIndicator />
      ) : (
        <ProfileData profile={profile} canEdit={!params?.visitingProfile} />
      )}
    </StyledSafeAreaView>
  );
};

export default Profile;
