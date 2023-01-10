import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import TopBar from 'components/TopBar';
import AccountProfilePic from 'screens/Home/components/AccountProfilePic';
import { useTheme } from 'react-native-paper';
import useDrawerContext from 'lib/AppDrawer/context';
import useActiveProfile from '@recoil/activeProfileState';
import EmptySessions from 'screens/WalletConnectSessions/components/EmptySessions';
import SessionsList from 'screens/WalletConnectSessions/components/SessionsList';
import { useActiveAccountWalletConnectSessions } from '@recoil/activeAccountWalletConnectSessionsState';
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

  return (
    <StyledSafeAreaView style={styles.root} padding={0} noIosPadding>
      {/* Top bar */}
      <TopBar
        style={styles.topBar}
        leftIconColor={theme.colors.icon['5']}
        stackProps={{ ...props, navigation: { ...navigation, openDrawer } }}
        rightElement={<AccountProfilePic profile={profile} />}
        title={t('authorizations')}
      />

      {/* / Sessions list */}
      {sessions.length !== 0 ? <SessionsList sessions={sessions} /> : <EmptySessions />}
    </StyledSafeAreaView>
  );
};

export default WalletConnectSessions;
