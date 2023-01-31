import React, { useCallback, useMemo } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import EditProfileButton from 'screens/Profile/components/EditProfileButton';
import useProfileGivenAddress from 'hooks/useProfileGivenAddress';
import useChainLinksGivenAddress from 'hooks/useChainLinksGivenAddress';
import useApplicationLinksGivenAddress from 'hooks/useApplicationLinksGivenAddress';
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
  const styles = useStyles();

  const navigation = useNavigation<NavProps['navigation']>();
  const { params } = useRoute<NavProps['route']>();
  const visitingProfile = params?.visitingProfile;
  const canEdit = !visitingProfile;

  const {
    profile,
    loading: loadingProfile,
    refetch: updateProfile,
  } = useProfileGivenAddress(visitingProfile);

  const {
    chainLinks,
    loading: loadingChainLinks,
    refetch: updateChainLinks,
  } = useChainLinksGivenAddress(profile?.address);

  const {
    applicationLinks,
    loading: loadingApplicationLinks,
    refetch: updateApplicationLinks,
  } = useApplicationLinksGivenAddress(profile?.address);

  useFocusEffect(
    useCallback(() => {
      // Refresh the data when the screen is focused
      updateProfile();
      updateChainLinks();
      updateApplicationLinks();
    }, [updateApplicationLinks, updateChainLinks, updateProfile]),
  );

  const isLoading = useMemo(
    () => loadingProfile || loadingChainLinks || loadingApplicationLinks,
    [loadingApplicationLinks, loadingChainLinks, loadingProfile],
  );

  return (
    <StyledSafeAreaView
      padding={0}
      topBar={
        <TopBar
          style={styles.topBar}
          leftIconStyle={styles.topBarButton}
          stackProps={{ navigation }}
          rightElement={
            canEdit && profile ? (
              <EditProfileButton profile={profile} style={styles.topBarButton} />
            ) : undefined
          }
        />
      }
    >
      {/* Profile data */}
      <ProfileData
        loading={isLoading}
        canEdit={canEdit}
        profile={profile}
        applicationLinks={applicationLinks}
        chainLinks={chainLinks}
      />
    </StyledSafeAreaView>
  );
};

export default Profile;
