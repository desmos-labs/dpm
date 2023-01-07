import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
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
import useActiveProfile from '@recoil/activeProfileState';
import AccountProfilePic from 'screens/Home/components/AccountProfilePic';
import { useActiveAccount } from '@recoil/activeAccountState';
import useActiveAccountBalance from 'hooks/useActiveAccountBalance';
import useStyles from './useStyles';
import AccountBalance from './components/AccountBalance';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.HOME>;

const Home: React.FC<NavProps> = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useStyles();

  const openDrawer = () => {
    console.log('Home - implement openDrawer');
  };

  const settings = useSettings();

  const account = useActiveAccount()!;
  const { profile, refetch: updateProfile } = useActiveProfile();
  const { balance, loading: balanceLoading } = useActiveAccountBalance();

  React.useEffect(() => {
    updateProfile();
  }, [updateProfile]);

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
      </View>
    </StyledSafeAreaView>
  );
};

export default Home;
