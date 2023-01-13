import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Typography from 'components/Typography';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { useSettings } from '@recoil/settings';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { DesmosMainnet } from '@desmoslabs/desmjs';
import { homeBackgroundDark, homeBackgroundLight } from 'assets/images';
import useActiveProfile from '@recoil/activeProfile';
import AccountProfilePic from 'screens/Home/components/AccountProfilePic';
import { useActiveAccount } from '@recoil/activeAccount';
import useActiveAccountBalance from 'hooks/useActiveAccountBalance';
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { HomeTabsParamList } from 'navigation/RootNavigator/HomeTabs';
import useDrawerContext from 'lib/AppDrawer/context';
import AccountTransactions from 'screens/Home/components/AccountTransactions';
import useActiveAccountTransactions from 'hooks/useActiveAccountTransactions';
import useStyles from './useStyles';
import AccountBalance from './components/AccountBalance';

export type NavProps = CompositeScreenProps<
  StackScreenProps<RootNavigatorParamList>,
  BottomTabScreenProps<HomeTabsParamList, ROUTES.HOME>
>;

const Home: React.FC<NavProps> = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useStyles();
  const { openDrawer } = useDrawerContext();

  const settings = useSettings();

  const account = useActiveAccount();
  const { profile, refetch: updateProfile } = useActiveProfile();
  const { balance, loading: balanceLoading, refetch: updateBalance } = useActiveAccountBalance();
  const {
    transactions,
    loading: transactionsLoading,
    refetch: reloadTransactions,
    fetchMore: fetchMoreTransactions,
  } = useActiveAccountTransactions();

  // Load the initial data
  useFocusEffect(
    React.useCallback(() => {
      updateProfile();
      updateBalance();
      reloadTransactions();
    }, [updateProfile, updateBalance, reloadTransactions]),
  );

  const onFetchMoreTxs = useCallback(() => {
    fetchMoreTransactions();
  }, [fetchMoreTransactions]);

  const onReloadTxs = useCallback(() => {
    reloadTransactions();
  }, [reloadTransactions]);

  return (
    <StyledSafeAreaView padding={0} noIosPadding>
      {/* Testnet chain badge */}
      {settings.chainName !== DesmosMainnet.chainName && (
        <View style={styles.testnetBadge}>
          <Text style={styles.testnetText}>TESTNET</Text>
        </View>
      )}

      {/* Background image */}
      <Image
        source={theme.dark ? homeBackgroundDark : homeBackgroundLight}
        resizeMode="stretch"
        style={styles.background}
      />

      {/* Top bar */}
      <TopBar
        style={styles.topBar}
        leftIconColor={theme.colors.icon['5']}
        stackProps={{ ...props, navigation: { ...navigation, openDrawer } }}
        rightElement={<AccountProfilePic profile={profile} />}
      />

      {/* Account balance */}
      <AccountBalance
        style={styles.userBalance}
        account={account}
        profile={profile}
        balance={balance}
        loading={balanceLoading}
      />

      {/* Transactions list */}
      <View style={styles.transactionsContainer}>
        <Typography.Subtitle>{t('transactions')}</Typography.Subtitle>
        <AccountTransactions
          transactions={transactions}
          loading={transactionsLoading}
          onFetchMore={onFetchMoreTxs}
          onReload={onReloadTxs}
        />
      </View>
    </StyledSafeAreaView>
  );
};

export default Home;
