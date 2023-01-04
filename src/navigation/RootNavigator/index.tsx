import { createStackNavigator } from '@react-navigation/stack';
import ROUTES from 'navigation/routes';
import React, { useMemo } from 'react';
import DevScreen from 'screens/DevScreen';
import Landing from 'screens/Landing';
import GenerateNewMnemonic from 'screens/GenerateNewMnemonic';
import CheckMnemonic, { CheckMnemonicParams } from 'screens/CheckMnemonic';
import PickDerivationPath, { SelectAddressParams } from 'screens/SelectAddress';
import ImportRecoveryPassphrase from 'screens/ImportRecoveryPassphrase';
import CreateWalletPassword, { CreateWalletPasswordParams } from 'screens/CreateWalletPassword';

export type RootNavigatorParamList = {
  [ROUTES.DEV_SCREEN]: undefined;
  [ROUTES.LANDING]: undefined;
  [ROUTES.CREATE_WALLET]: undefined;
  [ROUTES.IMPORT_RECOVERY_PASSPHRASE]: undefined;
  [ROUTES.CHECK_MNEMONIC]: CheckMnemonicParams;
  [ROUTES.SELECT_ACCOUNT]: SelectAddressParams;
  [ROUTES.CREATE_WALLET_PASSWORD]: CreateWalletPasswordParams;
};

const Stack = createStackNavigator<RootNavigatorParamList>();

const RootNavigator = () => {
  const initialRouteName = useMemo(() => {
    return ROUTES.DEV_SCREEN;
  }, []);

  return (
    <Stack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
      {__DEV__ && <Stack.Screen name={ROUTES.DEV_SCREEN} component={DevScreen} />}
      <Stack.Screen name={ROUTES.LANDING} component={Landing} />
      <Stack.Screen name={ROUTES.CREATE_WALLET} component={GenerateNewMnemonic} />
      <Stack.Screen name={ROUTES.IMPORT_RECOVERY_PASSPHRASE} component={ImportRecoveryPassphrase} />
      <Stack.Screen name={ROUTES.CHECK_MNEMONIC} component={CheckMnemonic} />
      <Stack.Screen name={ROUTES.SELECT_ACCOUNT} component={PickDerivationPath} />
      <Stack.Screen name={ROUTES.CREATE_WALLET_PASSWORD} component={CreateWalletPassword} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
