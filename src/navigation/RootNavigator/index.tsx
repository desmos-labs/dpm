import { createStackNavigator } from '@react-navigation/stack';
import ROUTES from 'navigation/routes';
import React, { useMemo } from 'react';
import DevScreen from 'screens/DevScreen';
import Landing from 'screens/Landing';
import GenerateNewMnemonic from 'screens/GenerateNewMnemonic';
import CheckMnemonic, { CheckMnemonicParams } from 'screens/CheckMnemonic';
import PickDerivationPath, { SelectAccountParams } from 'screens/PickDerivationPath';

export type RootNavigatorParamList = {
  [ROUTES.DEV_SCREEN]: undefined;
  [ROUTES.LANDING]: undefined;
  [ROUTES.CREATE_WALLET]: undefined;
  [ROUTES.CHECK_MNEMONIC]: CheckMnemonicParams;
  [ROUTES.SELECT_ACCOUNT]: SelectAccountParams;
  [ROUTES.CREATE_WALLET_PASSWORD]: undefined;
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
      <Stack.Screen name={ROUTES.CHECK_MNEMONIC} component={CheckMnemonic} />
      <Stack.Screen name={ROUTES.SELECT_ACCOUNT} component={PickDerivationPath} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
