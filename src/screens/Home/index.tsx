import Clipboard from '@react-native-community/clipboard';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';
import { Snackbar, useTheme } from 'react-native-paper';
import Typography from 'components/Typography';
import useDrawerContext from 'contexts/AppDrawerContex';
import useCurrentChainInfo from 'hooks/desmosclient/useCurrentChainInfo';
import useSetSetting from 'hooks/settings/useSetSetting';
import useFetchProfile from 'hooks/useFetchProfile';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import AvatarImage from 'components/AvatarImage';
import { useRecoilValue } from 'recoil';
import appSettingsState from '@recoil/settings';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { activeAccountAppState } from '@recoil/activeAccountState';
import AccountBalance from './components/AccountBalance';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.HOME>;

const Home: React.FC<NavProps> = (props) => {
  const { navigation } = props;
  const { openDrawer } = useDrawerContext();
  const account = useRecoilValue(activeAccountAppState);
  const settings = useRecoilValue(appSettingsState);
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useStyles();
  const profile = useFetchProfile(account!.address);
  const [snackBarMessage, setShowSnackbar] = useState<string | null>(null);
  const currentChain = useCurrentChainInfo();
  const hideBalance = useSetSetting('balanceHidden');

  const openProfileDetails = useCallback(() => {
    console.log('open profile');
  }, [navigation]);

  const onAddressCopy = useCallback(() => {
    Clipboard.setString(account!.address);
    console.log(account!.address);
    setShowSnackbar(t('address copied'));
  }, [t, account]);

  const onHideBalance = useCallback(() => {
    hideBalance(!settings.balanceHidden);
  }, [hideBalance, settings.balanceHidden]);

  const onSendPressed = useCallback(() => {
    console.log('send token');
  }, [navigation]);

  const onTxPressed = useCallback(
    (tx: any) => {
      console.log('tx pressed');
    },
    [navigation],
  );

  return (
    <StyledSafeAreaView padding={0} noIosPadding>
      {currentChain.chainLinkName !== 'desmos-mainnet' && (
        <View style={styles.testnetBadge}>
          <Text style={styles.testnetText}>TESTNET</Text>
        </View>
      )}

      <Image
        source={
          theme.dark
            ? require('assets/images/homeBackground-dark.png')
            : require('assets/images/homeBackground-light.png')
        }
        resizeMode="stretch"
        style={styles.background}
      />
      <TopBar
        style={styles.topBar}
        leftIconColor={theme.colors.icon['5']}
        stackProps={{
          ...props,
          navigation: {
            ...navigation,
            openDrawer,
          },
        }}
        rightElement={
          <AvatarImage
            size={30}
            style={styles.avatarImage}
            source={
              profile?.profilePicture
                ? {
                    uri: profile.profilePicture,
                  }
                : require('assets/images/defaultProfilePicture.png')
            }
            onPress={openProfileDetails}
          />
        }
      />
      <AccountBalance
        style={styles.userBalance}
        address={account!.address}
        nickname={profile?.nickname}
        onCopyPress={onAddressCopy}
        onSendPressed={onSendPressed}
        onHidePressed={onHideBalance}
      />
      <View style={styles.transactionsContainer}>
        <Typography.Subtitle>{t('transactions')}</Typography.Subtitle>
      </View>
      <Snackbar
        visible={snackBarMessage !== null}
        style={styles.snackbar}
        onDismiss={() => setShowSnackbar(null)}
        action={{
          label: t('hide'),
        }}
        duration={Snackbar.DURATION_SHORT}
      >
        <Typography.Body>{snackBarMessage}</Typography.Body>
      </Snackbar>
    </StyledSafeAreaView>
  );
};

export default Home;
