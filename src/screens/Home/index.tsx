import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { useSetting } from '@recoil/settings';
import ROUTES from 'navigation/routes';
import { DesmosMainnet } from '@desmoslabs/desmjs';
import { useFocusEffect } from '@react-navigation/native';
import useDrawerContext from 'lib/AppDrawer/context';
import useProfileGivenAddress from 'hooks/useProfileGivenAddress';
import AccountBalances, { AccountBalanceRef } from 'screens/Home/components/AccountBalances';
import { DPMImages } from 'types/images';
import EmptyList from 'components/EmptyList';
import ProfileImage from 'components/ProfileImage';
import Typography from 'components/Typography';
import { FlashList } from '@shopify/flash-list';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import { ListRenderItem } from '@shopify/flash-list/src/FlashListProps';
import { Transaction } from 'types/transactions';
import TransactionsListItem from 'screens/Home/components/TransactionsListItem';
import Spacer from 'components/Spacer';
import { useHomeShouldReloadData, useSetHomeShouldReloadData } from '@recoil/home';
import { HomeTabsScreenProps } from 'navigation/RootNavigator/HomeTabs/props';
import { useActiveAccountTransactions } from './hooks';
import useStyles from './useStyles';

export type NavProps = HomeTabsScreenProps<ROUTES.HOME>;

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
    data: transactions,
    loading: transactionsLoading,
    refresh: refreshTransactions,
    refreshing: refreshingTransactions,
    fetchMore: fetchMoreTransactions,
  } = useActiveAccountTransactions();

  const homeShouldReloadData = useHomeShouldReloadData();
  const setHomeShouldReloadData = useSetHomeShouldReloadData();

  // -------- REFS ---------

  const accountBalanceRef = useRef<AccountBalanceRef>();

  // -------- CALLBACKS --------

  const showProfileDetails = React.useCallback(() => {
    navigation.navigate(ROUTES.PROFILE);
  }, [navigation]);

  const refreshData = React.useCallback(() => {
    updateProfile();
    refreshTransactions();
    accountBalanceRef.current?.updateBalances();
  }, [updateProfile, refreshTransactions]);

  const renderTransactionItem = React.useCallback<ListRenderItem<Transaction>>(
    ({ item }) => (
      <>
        <TransactionsListItem transaction={item} />
        <Spacer paddingVertical={8} />
      </>
    ),
    [],
  );

  // ------- EFFECTS --------

  useFocusEffect(
    React.useCallback(() => {
      if (homeShouldReloadData) {
        refreshData();
        setHomeShouldReloadData(false);
      }
    }, [homeShouldReloadData, refreshData, setHomeShouldReloadData]),
  );

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
        <FlashList
          data={transactions}
          onEndReached={fetchMoreTransactions}
          onEndReachedThreshold={0.4}
          onRefresh={refreshData}
          refreshing={refreshingTransactions}
          renderItem={renderTransactionItem}
          estimatedItemSize={100}
          ListHeaderComponent={
            <>
              <AccountBalances reference={accountBalanceRef} />
              <Typography.SemiBold16>{t('common:transactions')}</Typography.SemiBold16>
              <Spacer paddingVertical={8} />
            </>
          }
          ListEmptyComponent={
            transactionsLoading || refreshTransactions ? undefined : (
              <EmptyList
                topPadding={0}
                image={DPMImages.NoTransaction}
                message={t('no transactions')}
              />
            )
          }
          ListFooterComponent={transactionsLoading ? <StyledActivityIndicator /> : undefined}
        />
      </View>
    </StyledSafeAreaView>
  );
};

export default Home;
