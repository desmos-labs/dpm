import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import ROUTES from 'navigation/routes';
import TopBar from 'components/TopBar';
import useDrawerContext from 'lib/AppDrawer/context';
import useActiveProfile from '@recoil/activeProfile';
import EmptySessions from 'screens/WalletConnectSessions/components/EmptySessions';
import SessionsList from 'screens/WalletConnectSessions/components/SessionsList';
import { useActiveAccountWalletConnectSessions } from '@recoil/activeAccountWalletConnectSessions';
import { useAllWalletConnectSessionsRequests } from '@recoil/walletConnectRequests';
import Button from 'components/Button';
import ProfileImage from 'components/ProfileImage';
import { HomeTabsScreenProps } from 'navigation/RootNavigator/HomeTabs/props';
import useStyles from './useStyles';

export type NavProps = HomeTabsScreenProps<ROUTES.WALLET_CONNECT_SESSIONS>;

/**
 * Screen that shows the current active account's WalletConnect sessions.
 */
const WalletConnectSessions = (props: NavProps) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const styles = useStyles();

  // -------- HOOKS --------

  const { openDrawer } = useDrawerContext();
  const { profile } = useActiveProfile();
  const sessions = useActiveAccountWalletConnectSessions();
  const requests = useAllWalletConnectSessionsRequests();

  // -------- CALLBACKS --------

  const showPendingRequests = useCallback(() => {
    navigation.navigate(ROUTES.WALLET_CONNECT_REQUEST);
  }, [navigation]);

  const showProfileDetails = React.useCallback(() => {
    navigation.navigate(ROUTES.PROFILE);
  }, [navigation]);

  return (
    <StyledSafeAreaView
      padding={0}
      edges={['top']}
      topBar={
        <TopBar
          stackProps={{ ...props, navigation: { ...navigation, openDrawer } }}
          rightElement={
            <ProfileImage
              style={styles.avatarImage}
              size={34}
              profile={profile}
              onPress={showProfileDetails}
            />
          }
          title={t('authorizations')}
        />
      }
    >
      {sessions.length !== 0 ? <SessionsList sessions={sessions} /> : <EmptySessions />}
      {requests.length > 0 && (
        <Button mode="contained" style={styles.showRequestsButtons} onPress={showPendingRequests}>
          {t('walletConnect:show pending requests')}
        </Button>
      )}
    </StyledSafeAreaView>
  );
};

export default WalletConnectSessions;
