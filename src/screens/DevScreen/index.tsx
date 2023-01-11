import StyledSafeAreaView from 'components/StyledSafeAreaView';
import Button from 'components/Button';
import React, { FC, useCallback } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useGetAccounts } from '@recoil/accounts';
import Typography from 'components/Typography';
import { FlatList, Text, TouchableOpacity } from 'react-native';
import Spacer from 'components/Spacer';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import * as WCMMKV from 'lib/MMKVStorage/walletconnect';
import { useStoreWalletConnectSession } from '@recoil/walletConnectSessions';
import { WalletConnectPermission, WalletConnectSession } from 'types/walletConnect';
import useStyles from './useStyles';

const routesToRender = [ROUTES.CREATE_NEW_MNEMONIC, ROUTES.PROFILE, ROUTES.HOME_TABS];

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.DEV_SCREEN>;

const DevScreen: FC<NavProps> = ({ navigation }) => {
  const { navigate } = navigation;
  const styles = useStyles();

  const accounts = useGetAccounts();
  const activeAccountAddress = useActiveAccountAddress();

  const itemSeparator = React.useCallback(() => <Spacer paddingVertical={4} />, []);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => {
        switch (item) {
          default:
            navigate(item);
            break;
        }
      }}
      style={styles.button}
    >
      <Text style={styles.text}>{item}</Text>
    </TouchableOpacity>
  );

  const navigateToLandingPage = useCallback(() => {
    navigation.navigate(ROUTES.LANDING);
  }, [navigation]);

  const goToExternalProfile = useCallback(() => {
    navigation.navigate(ROUTES.PROFILE, {
      visitingProfile: 'desmos1flzmju7m2lh0znhvkwwapkz9e7f39yjgcae2qz',
    });
  }, [navigation]);

  const clearWalletConnectMMKV = useCallback(() => {
    WCMMKV.clearAll();
  }, []);

  const storeWalletConnectSession = useStoreWalletConnectSession();
  const addWalletConnectSession = useCallback(() => {
    storeWalletConnectSession(activeAccountAddress!, {
      topic: 'test',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sign-check-icon.png/768px-Sign-check-icon.png',
      creationDate: new Date(),
      name: 'Go-Find.me',
      description:
        'Go-find.me allows to create your Desmos profile and find other users on the platform',
      url: 'https://go-find.me',
      permissions: [WalletConnectPermission.SIGN_TX, WalletConnectPermission.BROADCAST_TX],
    } as WalletConnectSession);
  }, [activeAccountAddress, storeWalletConnectSession]);

  return (
    <StyledSafeAreaView>
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={styles.flatList}
        data={routesToRender}
        renderItem={renderItem}
        ItemSeparatorComponent={itemSeparator}
      />

      <Spacer paddingVertical={4} />

      <Button mode="contained" onPress={goToExternalProfile} color="green">
        Visit external profile
      </Button>

      <Spacer paddingVertical={4} />

      <Button mode="contained" onPress={navigateToLandingPage}>
        Go to landing page
      </Button>

      <Spacer paddingVertical={4} />

      <Button mode="contained" onPress={addWalletConnectSession}>
        Add WalletConnect session
      </Button>

      <Spacer paddingVertical={4} />

      <Button mode="contained" onPress={clearWalletConnectMMKV}>
        Clear WalletConnect MMKV
      </Button>

      <Spacer paddingVertical={4} />

      <Typography.Caption>Address: {activeAccountAddress}</Typography.Caption>
      <Typography.Caption>Account: {Object.keys(accounts).length}</Typography.Caption>
    </StyledSafeAreaView>
  );
};

export default DevScreen;
