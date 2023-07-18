import React, { useCallback } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useNavigation, useRoute } from '@react-navigation/native';
import EditProfileButton from 'screens/Profile/components/EditProfileButton';
import useProfileGivenAddress from 'hooks/useProfileGivenAddress';
import useChainLinksGivenAddress from 'hooks/useChainLinksGivenAddress';
import useApplicationLinksGivenAddress from 'hooks/useApplicationLinksGivenAddress';
import { FlashList } from '@shopify/flash-list';
import { ListRenderItem } from '@shopify/flash-list/src/FlashListProps';
import { ChainLink } from 'types/desmos';
import ChainLinkItem from 'screens/Profile/components/ChainLinkItem';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import SingleButtonModal from 'modals/SingleButtonModal';
import { DPMImages } from 'types/images';
import useShowModal from 'hooks/useShowModal';
import ListItemSeparator from 'components/ListItemSeparator';
import NonExistingProfile from 'screens/Profile/components/NonExistingProfile';
import NoChainLinks from 'screens/Profile/components/NoChainLinks';
import TypographyContentLoaders from 'components/ContentLoaders/Typography';
import ChainLinkContentLoader from 'components/ContentLoaders/ChainLink';
import { View } from 'react-native';
import ProfileData from 'screens/Profile/components/ProfileData';
import useConnectChain from './hooks';
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
  const { t } = useTranslation();

  // -------- STATES --------

  const [refreshing, setRefreshing] = React.useState(false);

  // -------- HOOKS --------

  const {
    profile,
    loading: loadingProfile,
    refetch: refresgProfile,
  } = useProfileGivenAddress(visitingProfile);
  const {
    chainLinks,
    loading: loadingChainLinks,
    refetch: refreshChainLinks,
  } = useChainLinksGivenAddress(profile?.address);
  const {
    applicationLinks,
    loading: loadingApplicationLinks,
    refetch: refreshAppLinks,
  } = useApplicationLinksGivenAddress(profile?.address);
  const showModal = useShowModal();
  const onChainConnected = useCallback(() => {
    showModal(SingleButtonModal, {
      title: t('chainLinks:chain linked'),
      message: t('chainLinks:chain link created successfully'),
      actionLabel: t('common:ok'),
      image: DPMImages.Success,
    });
  }, [showModal, t]);
  const connectChain = useConnectChain(onChainConnected, chainLinks);

  // -------- VARIABLES --------

  const isLoading = React.useMemo(
    () => loadingProfile || loadingChainLinks || loadingApplicationLinks || refreshing,
    [loadingApplicationLinks, loadingChainLinks, loadingProfile, refreshing],
  );

  // -------- CALLBACKS --------

  const renderChainLinks = React.useCallback<ListRenderItem<ChainLink>>(
    ({ item }) => (
      <ChainLinkItem style={styles.horizontalPadding} chainLink={item} canEdit={canEdit} />
    ),
    [canEdit, styles.horizontalPadding],
  );

  const refreshProfile = React.useCallback(async () => {
    try {
      setRefreshing(true);
      await refresgProfile();
      await refreshAppLinks();
      await refreshChainLinks();
    } finally {
      setRefreshing(false);
    }
  }, [refresgProfile, refreshAppLinks, refreshChainLinks]);

  // -------- COMPONENTS --------

  const ListEmptyComponent = React.useCallback(() => {
    if (isLoading) {
      return (
        <View style={styles.horizontalPadding}>
          <TypographyContentLoaders.Body1 width={160} />
          <Spacer paddingTop={12} />
          <ChainLinkContentLoader />

          <Spacer paddingTop={12} />
          <ChainLinkContentLoader />

          <Spacer paddingTop={12} />
          <ChainLinkContentLoader />

          <Spacer paddingTop={12} />
          <ChainLinkContentLoader />
        </View>
      );
    }

    if (profile === undefined) {
      return <NonExistingProfile canCreate={canEdit} />;
    }

    return <NoChainLinks canEdit={canEdit} createNewLink={connectChain} />;
  }, [canEdit, connectChain, isLoading, profile, styles.horizontalPadding]);

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
      <FlashList
        ListHeaderComponent={
          <>
            <ProfileData
              loading={isLoading}
              canEdit={canEdit}
              profile={profile}
              applicationLinks={applicationLinks}
            />
            <Spacer paddingTop={8} />
            {chainLinks.length > 0 && !isLoading && (
              <>
                <Typography.SemiBold16 style={styles.horizontalPadding}>
                  {t('chainLinks:connected chains')}
                </Typography.SemiBold16>
                <Spacer paddingTop={8} />
              </>
            )}
          </>
        }
        data={isLoading ? [] : chainLinks}
        renderItem={renderChainLinks}
        ItemSeparatorComponent={ListItemSeparator}
        estimatedItemSize={68}
        ListEmptyComponent={ListEmptyComponent}
        onRefresh={refreshProfile}
        refreshing={refreshing}
      />

      {/* Connect button */}
      {canEdit && chainLinks.length > 0 && !isLoading && (
        <Button style={styles.connectButton} onPress={connectChain} mode="outlined">
          {t('connect chain')}
        </Button>
      )}
    </StyledSafeAreaView>
  );
};

export default Profile;
