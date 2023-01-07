import StyledSafeAreaView from 'components/StyledSafeAreaView';
import Button from 'components/Button';
import React, { FC, useCallback } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useGetAccounts, useStoreAccount } from '@recoil/accounts';
import Typography from 'components/Typography';
import { FlatList, Text, TouchableOpacity } from 'react-native';
import Spacer from 'components/Spacer';
import { useActiveAccountAddress, useSetActiveAccountAddress } from '@recoil/activeAccountState';
import { MnemonicAccount } from 'types/account';
import { DesmosHdPath } from 'types/chainsHdPaths';
import { WalletType } from 'types/wallet';
import useStyles from './useStyles';

const routesToRender = [ROUTES.LANDING, ROUTES.CREATE_NEW_MNEMONIC, ROUTES.PROFILE, ROUTES.HOME];

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.DEV_SCREEN>;

const DevScreen: FC<NavProps> = ({ navigation }) => {
  const { navigate } = navigation;
  const styles = useStyles();

  const accounts = useGetAccounts();
  const activeAccountAddress = useActiveAccountAddress();

  const setActiveAccountAddress = useSetActiveAccountAddress();
  const storeAccount = useStoreAccount();

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
    navigation.navigate({
      name: ROUTES.LANDING,
      params: undefined,
    });
  }, [navigation]);

  const setActiveAccount = useCallback(async () => {
    storeAccount({
      walletType: WalletType.Mnemonic,
      address: 'desmos1nm6kh6jwqmsezwtnmgdd4w4tzyk9f8gvqu5en0',
      algo: 'secp256k1',
      hdPath: DesmosHdPath,
      pubKey: new Uint8Array(),
    } as MnemonicAccount);
    setActiveAccountAddress('desmos1nm6kh6jwqmsezwtnmgdd4w4tzyk9f8gvqu5en0');
  }, [storeAccount, setActiveAccountAddress]);

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

      <Button mode="contained" color="blue" onPress={setActiveAccount}>
        Set active account
      </Button>

      <Spacer paddingVertical={4} />

      <Button mode="contained" onPress={navigateToLandingPage}>
        Go to landing page
      </Button>

      <Spacer paddingVertical={4} />

      <Typography.Caption>Address: {activeAccountAddress}</Typography.Caption>
      <Typography.Caption>Account: {Object.keys(accounts).length}</Typography.Caption>
    </StyledSafeAreaView>
  );
};

export default DevScreen;
