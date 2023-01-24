import React, { useCallback, useMemo } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import EditProfileButton from 'screens/Profile/components/EditProfileButton';
import useProfileGivenAddress from 'hooks/useProfileGivenAddress';
import useModal from 'hooks/useModal';
import LoadingModal from 'modals/LoadingModal';
import { useTranslation } from 'react-i18next';
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
  const theme = useTheme();
  const { t } = useTranslation('profile');

  const navigation = useNavigation<NavProps['navigation']>();
  const { params } = useRoute<NavProps['route']>();
  const visitingProfile = params?.visitingProfile;
  const canEdit = !visitingProfile;

  const { showModal, hideModal } = useModal();

  const { profile, loading: loadingProfile } = useProfileGivenAddress(visitingProfile);

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
      updateChainLinks();
      updateApplicationLinks();
    }, [updateApplicationLinks, updateChainLinks]),
  );

  const isLoading = useMemo(
    () => loadingProfile || loadingChainLinks || loadingApplicationLinks,
    [loadingApplicationLinks, loadingChainLinks, loadingProfile],
  );

  React.useEffect(() => {
    if (isLoading) {
      showModal(LoadingModal, {
        text: `${t('loading profile')}...`,
      });
    } else {
      hideModal();
    }
  }, [hideModal, isLoading, showModal, t]);

  return (
    <StyledSafeAreaView
      padding={0}
      topBar={
        <TopBar
          style={styles.topBar}
          leftIconColor={theme.colors.icon['5']}
          stackProps={{ navigation }}
          rightElement={canEdit && profile ? <EditProfileButton profile={profile} /> : undefined}
        />
      }
    >
      {/* Profile data */}
      {!isLoading && (
        <ProfileData
          canEdit={canEdit}
          profile={profile}
          applicationLinks={applicationLinks}
          chainLinks={chainLinks}
        />
      )}
    </StyledSafeAreaView>
  );
};

export default Profile;
