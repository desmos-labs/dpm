import { createStackNavigator } from '@react-navigation/stack';
import ROUTES from 'navigation/routes';
import React, { useMemo } from 'react';
import DevScreen from 'screens/DevScreen';
import Landing from 'screens/Landing';
import CreateNewMnemonic from 'screens/CreateNewMnemonic';
import CheckMnemonic, { CheckMnemonicParams } from 'screens/CheckMnemonic';
import PickDerivationPath, { SelectAccountParams } from 'screens/SelectAccount';
import ImportAccountFromMnemonic from 'screens/ImportAccountFromMnemonic';
import CreateWalletPassword, { CreateWalletPasswordParams } from 'screens/CreateWalletPassword';
import CheckWalletPassword, { CheckWalletPasswordParams } from 'screens/CheckWalletPassword';
import SaveGeneratedAccount, { SaveGeneratedAccountParams } from 'screens/SaveGeneratedAccount';
import ConnectToLedgerStack, {
  ConnectToLedgerStackParams,
} from 'navigation/RootNavigator/ConnectToLedgerStack';
import Profile, { ProfileParams } from 'screens/Profile';
import ChainLinkDetails, { ChainLinkDetailsProps } from 'screens/ChainLinkDetails';
import ImportAccountSelectChain from 'screens/ImportAccountSelectChain';
import ImportAccountSelectType from 'screens/ImportAccountSelectType';
import ImportAccountSelectLedgerApp from 'screens/ImportAccountSelectLedgerApp';
import UnlockWallet, { UnlockWalletParams } from 'screens/UnlockWallet';
import SendTokens from 'screens/SendTokens';
import BroadcastTx, { BroadcastTxParams } from 'screens/BroadcastTx';
import ModalScreen, { ModalScreenParams } from 'modals/ModalScreen';
import EditProfile, { EditProfileParas } from 'screens/EditProfile';
import HomeTabs from 'navigation/RootNavigator/HomeTabs';

export type RootNavigatorParamList = {
  [ROUTES.DEV_SCREEN]: undefined;
  [ROUTES.LANDING]: undefined;
  [ROUTES.CREATE_NEW_MNEMONIC]: undefined;
  [ROUTES.IMPORT_ACCOUNT_SELECT_CHAIN]: undefined;
  [ROUTES.IMPORT_ACCOUNT_SELECT_TYPE]: undefined;
  [ROUTES.IMPORT_ACCOUNT_FROM_MNEMONIC]: undefined;
  [ROUTES.IMPORT_ACCOUNT_SELECT_LEDGER_APP]: undefined;
  [ROUTES.CHECK_MNEMONIC]: CheckMnemonicParams;
  [ROUTES.SELECT_ACCOUNT]: SelectAccountParams;
  [ROUTES.CREATE_WALLET_PASSWORD]: CreateWalletPasswordParams;
  [ROUTES.CHECK_WALLET_PASSWORD]: CheckWalletPasswordParams;
  [ROUTES.SAVE_GENERATED_ACCOUNT]: SaveGeneratedAccountParams;

  [ROUTES.CONNECT_TO_LEDGER_STACK]: ConnectToLedgerStackParams;
  [ROUTES.HOME_TABS]: undefined;
  [ROUTES.HOME]: undefined;

  [ROUTES.PROFILE]: ProfileParams | undefined;
  [ROUTES.EDIT_PROFILE]: EditProfileParas;
  [ROUTES.SEND_TOKENS]: undefined;
  [ROUTES.CHAIN_LINK_DETAILS]: ChainLinkDetailsProps;
  [ROUTES.UNLOCK_WALLET]: UnlockWalletParams;
  [ROUTES.BROADCAST_TX]: BroadcastTxParams;
  [ROUTES.MODAL]: ModalScreenParams;
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
        name={ROUTES.IMPORT_ACCOUNT_SELECT_CHAIN}
        component={ImportAccountSelectChain}
      />
      <Stack.Screen name={ROUTES.IMPORT_ACCOUNT_SELECT_TYPE} component={ImportAccountSelectType} />
      <Stack.Screen
        name={ROUTES.IMPORT_ACCOUNT_FROM_MNEMONIC}
        component={ImportAccountFromMnemonic}
      />
      <Stack.Screen
        name={ROUTES.IMPORT_ACCOUNT_SELECT_LEDGER_APP}
        component={ImportAccountSelectLedgerApp}
      />
      <Stack.Screen name={ROUTES.CHECK_MNEMONIC} component={CheckMnemonic} />
      <Stack.Screen name={ROUTES.SELECT_ACCOUNT} component={PickDerivationPath} />
      <Stack.Screen name={ROUTES.CREATE_WALLET_PASSWORD} component={CreateWalletPassword} />
      <Stack.Screen name={ROUTES.CHECK_WALLET_PASSWORD} component={CheckWalletPassword} />
      <Stack.Screen name={ROUTES.SAVE_GENERATED_ACCOUNT} component={SaveGeneratedAccount} />

      <Stack.Screen name={ROUTES.CONNECT_TO_LEDGER_STACK} component={ConnectToLedgerStack} />
      <Stack.Screen name={ROUTES.UNLOCK_WALLET} component={UnlockWallet} />

      <Stack.Screen name={ROUTES.HOME_TABS} component={HomeTabs} />

      <Stack.Screen name={ROUTES.PROFILE} component={Profile} />
      <Stack.Screen name={ROUTES.EDIT_PROFILE} component={EditProfile} />
      <Stack.Screen name={ROUTES.SEND_TOKENS} component={SendTokens} />
      <Stack.Screen name={ROUTES.CHAIN_LINK_DETAILS} component={ChainLinkDetails} />
      <Stack.Screen name={ROUTES.BROADCAST_TX} component={BroadcastTx} />
      <Stack.Screen
        name={ROUTES.MODAL}
        component={ModalScreen}
        options={{
          presentation: 'transparentModal',
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
