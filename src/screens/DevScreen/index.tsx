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
import { WalletConnectSession } from 'types/walletConnect';
import { useStoreWalletConnectSessionRequest } from '@recoil/walletConnectRequests';
import { CosmosRPCMethods } from '@desmoslabs/desmjs-walletconnect-v2';
import { EncodeObject } from '@cosmjs/proto-signing';
import { StdFee, StdSignDoc } from '@cosmjs/amino';
import { SignClientTypes } from '@walletconnect/types';
import useStyles from './useStyles';

const routesToRender = [
  ROUTES.CREATE_NEW_MNEMONIC,
  ROUTES.PROFILE,
  ROUTES.HOME_TABS,
  ROUTES.SETTINGS,
];

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
  const storeWalletConnectRequest = useStoreWalletConnectSessionRequest();
  const addWalletConnectSession = useCallback(() => {
    storeWalletConnectSession(activeAccountAddress!, {
      topic: 'test',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Sign-check-icon.png/768px-Sign-check-icon.png',
      creationDate: new Date().toISOString(),
      name: 'Go-Find.me',
      description:
        'Go-find.me allows to create your Desmos profile and find other users on the platform',
      url: 'https://go-find.me',
    } as WalletConnectSession);
    // Add 2 fake requests
    for (let i = 0; i < 2; i += 1) {
      storeWalletConnectRequest({
        method: CosmosRPCMethods.SignAmino,
        request: {} as SignClientTypes.EventArguments['session_request'],
        id: i,
        topic: 'test',
        signerAddress: activeAccountAddress!,
        fee: { amount: [{ denom: 'udaric', amount: '1000' }], gas: '20000' } as StdFee,
        memo: '',
        msgs: [
          {
            typeUrl: '/desmos.profiles.v3.MsgSaveProfile',
            value: {
              bio: 'test',
              creator: activeAccountAddress!,
              dtag: 'test-dtag',
              nickname: 'test-nickname',
              coverPicture: '',
              profilePicture: '',
            },
          },
        ] as EncodeObject[],
        signDoc: {} as StdSignDoc,
        accountAddress: activeAccountAddress!,
      });
    }
  }, [activeAccountAddress, storeWalletConnectRequest, storeWalletConnectSession]);

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
        Add WalletConnect session and requests
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
