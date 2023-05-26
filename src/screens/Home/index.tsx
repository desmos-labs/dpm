import { StackScreenProps } from '@react-navigation/stack';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { useSetting } from '@recoil/settings';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { DesmosMainnet } from '@desmoslabs/desmjs';
import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { HomeTabsParamList } from 'navigation/RootNavigator/HomeTabs';
import useDrawerContext from 'lib/AppDrawer/context';
import useActiveAccountTransactions from 'hooks/useActiveAccountTransactions';
import useProfileGivenAddress from 'hooks/useProfileGivenAddress';
import AccountBalances, { AccountBalanceRef } from 'screens/Home/components/AccountBalances';
import TransactionsList from 'screens/Home/components/TransactionsList';
import { DPMImages } from 'types/images';
import EmptyList from 'components/EmptyList';
import ProfileImage from 'components/ProfileImage';
import Typography from 'components/Typography';
import useStyles from './useStyles';

export type NavProps = CompositeScreenProps<
  StackScreenProps<RootNavigatorParamList>,
  BottomTabScreenProps<HomeTabsParamList, ROUTES.HOME>
>;

/**
 * Screen that shows the user's balances and transactions history
 * and let him stake or send some tokens.
 */
const Home: React.FC<NavProps> = (props) => {
  const { navigation } = props;
  const { t } = useTranslation('account');
  const theme = useTheme();
  const styles = useStyles();
  const { openDrawer } = useDrawerContext();

  const chainName = useSetting('chainName');
  const { profile, refetch: updateProfile } = useProfileGivenAddress();
  const {
    transactions,
    loading: transactionsLoading,
    refetch: reloadTransactions,
    fetchMore: fetchMoreTransactions,
  } = useActiveAccountTransactions();

  // -------- REFS ---------

  const accountBalanceRef = useRef<AccountBalanceRef>();

  // -------- CALLBACKS --------

  const showProfileDetails = React.useCallback(() => {
    navigation.navigate(ROUTES.PROFILE);
  }, [navigation]);

  const refreshData = React.useCallback(() => {
    updateProfile();
    reloadTransactions();
    accountBalanceRef.current?.updateBalances();
  }, [updateProfile, reloadTransactions]);

  // ------- EFFECTS --------

  useFocusEffect(refreshData);

  return (
    <StyledSafeAreaView padding={0} noIosPadding>
      {/* Testnet chain badge */}
      {chainName !== DesmosMainnet.chainName && (
        <View style={styles.testnetBadge}>
          <Text style={styles.testnetText}>TESTNET</Text>
        </View>
      )}

      {/* Top bar */}
      <TopBar
        leftIconColor={theme.colors.icon['1']}
        title={profile?.nickname ?? profile?.dtag}
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

      {/* Transactions list */}
      <View style={styles.transactionsContainer}>
        <TransactionsList
          headerComponent={
            <>
              <AccountBalances reference={accountBalanceRef} />
              <Typography.Body1>{t('common:transactions')}</Typography.Body1>
            </>
          }
          emptyComponent={
            <EmptyList
              topPadding={0}
              image={DPMImages.NoTransaction}
              message={t('no transactions')}
            />
          }
          loading={transactionsLoading}
          transactions={transactions}
          onFetchMore={fetchMoreTransactions}
          onRefresh={refreshData}
        />
      </View>
    </StyledSafeAreaView>
  );
};

export default Home;
