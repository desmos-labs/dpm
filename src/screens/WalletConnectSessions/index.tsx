import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import TopBar from 'components/TopBar';
import AccountProfilePic from 'screens/Home/components/AccountProfilePic';
import { useTheme } from 'react-native-paper';
import useDrawerContext from 'lib/AppDrawer/context';
import useActiveProfile from '@recoil/activeProfile';
import EmptySessions from 'screens/WalletConnectSessions/components/EmptySessions';
import SessionsList from 'screens/WalletConnectSessions/components/SessionsList';
import { useActiveAccountWalletConnectSessions } from '@recoil/activeAccountWalletConnectSessions';
import { useAllWalletConnectSessionsRequests } from '@recoil/walletConnectRequests';
import Button from 'components/Button';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.WALLET_CONNECT_SESSIONS>;

const WalletConnectSessions = (props: NavProps) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useStyles();
  const { openDrawer } = useDrawerContext();
  const { profile } = useActiveProfile();
  const sessions = useActiveAccountWalletConnectSessions();
  const requests = useAllWalletConnectSessionsRequests();

  const showPendingRequests = useCallback(() => {
    navigation.navigate(ROUTES.WALLET_CONNECT_REQUEST);
  }, [navigation]);

  return (
    <StyledSafeAreaView
      padding={0}
      noIosPadding
      style={styles.root}
      topBar={
        <TopBar
          style={styles.topBar}
          titleStyle={styles.topBarTitle}
          leftIconColor={theme.colors.icon['5']}
          stackProps={{ ...props, navigation: { ...navigation, openDrawer } }}
          rightElement={<AccountProfilePic profile={profile} />}
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
