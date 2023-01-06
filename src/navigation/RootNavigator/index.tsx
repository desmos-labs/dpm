import { createStackNavigator } from '@react-navigation/stack';
import ROUTES from 'navigation/routes';
import React, { useMemo } from 'react';
import DevScreen from 'screens/DevScreen';
import Landing from 'screens/Landing';
import CreateNewMnemonic from 'screens/CreateNewMnemonic';
import CheckMnemonic, { CheckMnemonicParams } from 'screens/CheckMnemonic';
import PickDerivationPath, { SelectAddressParams } from 'screens/SelectAccount';
import CreateAccountFromMnemonic, {
  CreateAccountFromMnemonicParams,
} from 'screens/CreateAccountFromMnemonic';
import CreateWalletPassword, { CreateWalletPasswordParams } from 'screens/CreateWalletPassword';
import CheckWalletPassword, { CheckWalletPasswordParams } from 'screens/CheckWalletPassword';
import SaveGeneratedAccount, { SaveGeneratedAccountParams } from 'screens/SaveGeneratedAccount';
import ConnectToLedgerStack, {
  ConnectToLedgerStackParams,
} from 'navigation/RootNavigator/ConnectToLedgerStack';
import Home from 'screens/Home';
import Profile, { ProfileAccountParams } from 'screens/Profile';
import ChainLinkDetails, { ChainLinkDetailsProps } from 'screens/ChainLinkDetails';

export type RootNavigatorParamList = {
  [ROUTES.DEV_SCREEN]: undefined;
  [ROUTES.LANDING]: undefined;
  [ROUTES.CREATE_NEW_MNEMONIC]: undefined;
  [ROUTES.CREATE_ACCOUNT_FROM_MNEMONIC]: CreateAccountFromMnemonicParams;
  [ROUTES.CHECK_MNEMONIC]: CheckMnemonicParams;
  [ROUTES.SELECT_ACCOUNT]: SelectAddressParams;
  [ROUTES.CREATE_WALLET_PASSWORD]: CreateWalletPasswordParams;
  [ROUTES.CHECK_WALLET_PASSWORD]: CheckWalletPasswordParams;
  [ROUTES.SAVE_GENERATED_ACCOUNT]: SaveGeneratedAccountParams;

  [ROUTES.CONNECT_TO_LEDGER_STACK]: ConnectToLedgerStackParams;
  [ROUTES.HOME]: undefined;

  [ROUTES.PROFILE]: ProfileAccountParams;
  [ROUTES.CHAIN_LINK_DETAILS]: ChainLinkDetailsProps;
};

const Stack = createStackNavigator<RootNavigatorParamList>();

const RootNavigator = () => {
  const initialRouteName = useMemo(() => ROUTES.DEV_SCREEN, []);

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName as keyof RootNavigatorParamList}
      screenOptions={{ headerShown: false }}
    >
      {__DEV__ && <Stack.Screen name={ROUTES.DEV_SCREEN} component={DevScreen} />}
      <Stack.Screen name={ROUTES.LANDING} component={Landing} />
      <Stack.Screen name={ROUTES.CREATE_NEW_MNEMONIC} component={CreateNewMnemonic} />
      <Stack.Screen
        name={ROUTES.CREATE_ACCOUNT_FROM_MNEMONIC}
        component={CreateAccountFromMnemonic}
      />
      <Stack.Screen name={ROUTES.CHECK_MNEMONIC} component={CheckMnemonic} />
      <Stack.Screen name={ROUTES.SELECT_ACCOUNT} component={PickDerivationPath} />
      <Stack.Screen name={ROUTES.CREATE_WALLET_PASSWORD} component={CreateWalletPassword} />
      <Stack.Screen name={ROUTES.CHECK_WALLET_PASSWORD} component={CheckWalletPassword} />
      <Stack.Screen name={ROUTES.SAVE_GENERATED_ACCOUNT} component={SaveGeneratedAccount} />

      <Stack.Screen name={ROUTES.CONNECT_TO_LEDGER_STACK} component={ConnectToLedgerStack} />

      <Stack.Screen name={ROUTES.HOME} component={Home} />

      <Stack.Screen name={ROUTES.PROFILE} component={Profile} />
      <Stack.Screen name={ROUTES.CHAIN_LINK_DETAILS} component={ChainLinkDetails} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
