import Clipboard from '@react-native-community/clipboard';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native';
import { Snackbar, useTheme } from 'react-native-paper';
import TransactionsList from 'components/TransactionsList';
import Typography from 'components/Typography';
import useDrawerContext from 'contexts/AppDrawerContex';
import useCurrentChainInfo from 'hooks/desmosclient/useCurrentChainInfo';
import useSetSetting from 'hooks/settings/useSetSetting';
import useFetchProfile from 'hooks/useFetchProfile';
import useSelectedAccount from 'hooks/useSelectedAccount';
import { AccountScreensStackParams, HomeScreensBottomTabsParams } from 'types/navigation';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import AvatarImage from 'components/AvatarImage';
import { useRecoilValue } from 'recoil';
import appSettingsState from '@recoil/settings';
import AccountBalance from './components/AccountBalance';
import useStyles from './useStyles';

export type Props = CompositeScreenProps<
  BottomTabScreenProps<HomeScreensBottomTabsParams, 'Home'>,
  StackScreenProps<AccountScreensStackParams>
>;

const Home: React.FC<Props> = (props) => {
  const { navigation } = props;
  const { openDrawer } = useDrawerContext();
  const account = useSelectedAccount();
  const settings = useRecoilValue(appSettingsState);
  const { t } = useTranslation();
  const theme = useTheme();
  const styles = useStyles();
  const profile = useFetchProfile(account.address);
  const [snackBarMessage, setShowSnackbar] = useState<string | null>(null);
  const currentChain = useCurrentChainInfo();
  const hideBalance = useSetSetting('balanceHidden');

  const openProfileDetails = useCallback(() => {
    navigation.navigate({
      name: 'Profile',
      params: undefined,
    });
  }, [navigation]);

  const onAddressCopy = useCallback(() => {
    Clipboard.setString(account.address);
    console.log(account.address);
    setShowSnackbar(t('address copied'));
  }, [t, account]);

  const onHideBalance = useCallback(() => {
    hideBalance(!settings.balanceHidden);
  }, [hideBalance, settings.balanceHidden]);

  const onSendPressed = useCallback(() => {
    navigation.navigate({
      name: 'SendToken',
      params: undefined,
    });
  }, [navigation]);

  const onTxPressed = useCallback(
    (tx: any) => {
      navigation.navigate({
        name: 'TxDetails',
        params: {
          messages: tx.msgs,
          fee: tx.fee,
          memo: tx.memo,
          success: tx.success,
          dateTime: new Date(tx.timestamp),
          hash: tx.hash,
        },
      });
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
        address={account.address}
        nickname={profile?.nickname}
        onCopyPress={onAddressCopy}
        onSendPressed={onSendPressed}
        onHidePressed={onHideBalance}
      />
      <View style={styles.transactionsContainer}>
        <Typography.Subtitle>{t('transactions')}</Typography.Subtitle>
        <TransactionsList
          style={styles.transactionList}
          onTxPressed={onTxPressed}
          chainAccount={account}
        />
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
