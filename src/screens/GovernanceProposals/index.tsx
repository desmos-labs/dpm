import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { HomeTabsParamList } from 'navigation/RootNavigator/HomeTabs';
import ROUTES from 'navigation/routes';
import React from 'react';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import ProfileImage from 'components/ProfileImage';
import useDrawerContext from 'lib/AppDrawer/context';
import useProfileGivenAddress from 'hooks/profile/useProfileGivenAddress';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { ListRenderItem } from '@shopify/flash-list/src/FlashListProps';
import { Proposal } from 'types/proposals';
import ProposalListItem from 'screens/GovernanceProposals/components/ProposalListItem';
import EmptyList from 'components/EmptyList';
import { DPMImages } from 'types/images';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import StyledRefreshControl from 'components/StyledRefreshControl';
import { useFetchProposals } from './hooks';
import useStyles from './useStyles';

export type NavProps = CompositeScreenProps<
  StackScreenProps<RootNavigatorParamList>,
  BottomTabScreenProps<HomeTabsParamList, ROUTES.GOVERNANCE_PROPOSALS>
>;

/**
 * Screen that shows the governance proposals and allow
 * the user to interact with them.
 */
const GovernanceProposals: React.FC<NavProps> = (props) => {
  const { navigation } = props;
  const { t } = useTranslation('governance');
  const styles = useStyles();
  const theme = useTheme();

  // -------- HOOKS --------

  const { openDrawer } = useDrawerContext();
  const { profile } = useProfileGivenAddress();
  const { data, loading, refresh, refreshing, error, fetchMore } = useFetchProposals();

  // -------- CALLBACKS --------

  const showProfileDetails = React.useCallback(() => {
    navigation.navigate(ROUTES.PROFILE);
  }, [navigation]);

  const showProposalDetails = React.useCallback(
    (proposal: Proposal) => {
      navigation.navigate(ROUTES.GOVERNANCE_PROPOSAL_DETAILS, {
        proposal,
      });
    },
    [navigation],
  );

  const renderProposal = React.useCallback<ListRenderItem<Proposal>>(
    ({ item }) => (
      <>
        <ProposalListItem proposal={item} onPress={showProposalDetails} />
        <Spacer paddingVertical={8} />
      </>
    ),
    [showProposalDetails],
  );

  return (
    <StyledSafeAreaView
      topBar={
        <TopBar
          leftIconColor={theme.colors.icon['1']}
          title={t('proposals')}
          stackProps={{ ...props, navigation: { ...navigation, openDrawer } }}
          rightElement={
            <ProfileImage
              size={34}
              profile={profile}
              style={styles.avatarImage}
              onPress={showProfileDetails}
            />
          }
        />
      }
    >
      <FlashList
        data={data}
        renderItem={renderProposal}
        estimatedItemSize={155}
        refreshControl={<StyledRefreshControl refreshing={refreshing} onRefresh={refresh} />}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          !loading && !refreshing ? (
            <EmptyList
              message={error?.message ?? t('no proposals')}
              image={error !== undefined ? DPMImages.NoData : DPMImages.EmptyList}
              extraComponent={
                error !== undefined ? (
                  <Button mode={'outlined'} onPress={refresh}>
                    {t('common:retry')}
                  </Button>
                ) : undefined
              }
            />
          ) : null
        }
        ListFooterComponent={loading ? <StyledActivityIndicator /> : undefined}
      />
    </StyledSafeAreaView>
  );
};

export default GovernanceProposals;
