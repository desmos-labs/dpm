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
import { useActiveAccountAddress } from '@recoil/activeAccountState';
import useStyles from './useStyles';

const routesToRender = [ROUTES.LANDING, ROUTES.CREATE_NEW_MNEMONIC, ROUTES.PROFILE, ROUTES.HOME];

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
    navigation.navigate({
      name: ROUTES.LANDING,
      params: undefined,
    });
  }, [navigation]);

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
