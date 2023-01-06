import StyledSafeAreaView from 'components/StyledSafeAreaView';
import Button from 'components/Button';
import React, { FC, useCallback } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { getAccounts } from '@recoil/accounts';
import Typography from 'components/Typography';
import { FlatList, Text, TouchableOpacity } from 'react-native';
import Spacer from 'components/Spacer';
import { useUnlockWallet } from 'hooks/useUnlockWallet';
import useStyles from './useStyles';

const routesToRender = [ROUTES.LANDING, ROUTES.CREATE_NEW_MNEMONIC, ROUTES.PROFILE, ROUTES.HOME];

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.DEV_SCREEN>;

const DevScreen: FC<NavProps> = ({ navigation }) => {
  const { navigate } = navigation;
  const styles = useStyles();

  const accounts = getAccounts();
  const unlockWallet = useUnlockWallet();

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

  const navigateToProfile = (address: string) =>
    useCallback(() => {
      navigate(ROUTES.PROFILE, {
        visitingProfile: address,
      });
    }, []);

  const navigateToLandingPage = useCallback(() => {
    navigation.navigate({
      name: ROUTES.LANDING,
      params: undefined,
    });
  }, [navigation]);

  const testUnlockWallet = useCallback(async () => {
    const wallet = await unlockWallet();
    console.log('unlocked wallet', wallet);
  }, [unlockWallet]);

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

      <Button
        mode="contained"
        color="green"
        onPress={navigateToProfile('desmos16c60y8t8vra27zjg2arlcd58dck9cwn7p6fwtd')}
      >
        Profile with chain links
      </Button>

      <Spacer paddingVertical={4} />

      <Button
        mode="contained"
        color="orange"
        onPress={navigateToProfile('desmos1rz9wvs95jsndxjpqhqndwa3urd930zrf7c5lcs')}
      >
        Profile without chain links
      </Button>

      <Spacer paddingVertical={4} />

      <Button
        mode="contained"
        color="red"
        onPress={navigateToProfile('desmos1jgv4e2rfd740hen27d805pxayzk4hpvekv92g9')}
      >
        Non existing profile
      </Button>

      <Spacer paddingVertical={4} />

      <Button mode="contained" onPress={navigateToLandingPage}>
        Go to landing page
      </Button>

      <Spacer paddingVertical={4} />

      <Button mode="contained" onPress={testUnlockWallet}>
        Unlock wallet
      </Button>
      <Spacer paddingVertical={4} />
      <Typography.H1>Account: {Object.keys(accounts).length}</Typography.H1>
    </StyledSafeAreaView>
  );
};

export default DevScreen;
