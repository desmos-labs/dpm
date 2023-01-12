import { createStackNavigator } from '@react-navigation/stack';
import ROUTES from 'navigation/routes';
import React, { useEffect, useMemo } from 'react';
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
import EditProfile, { EditProfileParams } from 'screens/EditProfile';
import HomeTabs from 'navigation/RootNavigator/HomeTabs';
import useInitWalletConnectClient from 'hooks/walletconnect/useInitWalletConnectClient';
import Settings from 'screens/Settings';
import SettingsDisplayMode from 'screens/SettingsDisplayMode';
import SettingsSwitchChain from 'screens/SettingsSwitchChain';
import SettingsChangeWalletPassword from 'screens/SettingsChangeWalletPassword';
import WalletConnectSessionProposal, {
  WalletConnectSessionProposalParams,
} from 'screens/WalletConnectSessionProposal';
import SettingsJoinCommunity from 'screens/SettingsJoinCommunity';
import MarkdownText, { MarkdownTextProps } from 'screens/MarkdownText';

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
  [ROUTES.SCAN_QR_CODE]: undefined;
  [ROUTES.WALLET_CONNECT_SESSIONS]: undefined;
  [ROUTES.WALLET_CONNECT_SESSION_PROPOSAL]: WalletConnectSessionProposalParams;
  [ROUTES.WALLET_CONNECT_REQUEST_LIST]: undefined;
  [ROUTES.WALLET_CONNECT_REQUEST]: undefined;

  [ROUTES.PROFILE]: ProfileParams | undefined;
  [ROUTES.EDIT_PROFILE]: EditProfileParams;
  [ROUTES.SEND_TOKENS]: undefined;
  [ROUTES.CHAIN_LINK_DETAILS]: ChainLinkDetailsProps;
  [ROUTES.UNLOCK_WALLET]: UnlockWalletParams;
  [ROUTES.BROADCAST_TX]: BroadcastTxParams;
  [ROUTES.MODAL]: ModalScreenParams;

  [ROUTES.SETTINGS]: undefined;
  [ROUTES.SETTINGS_DISPLAY_MODE]: undefined;
  [ROUTES.SETTINGS_SWITCH_CHAIN]: undefined;
  [ROUTES.SETTINGS_CHANGE_APPLICATION_PASSWORD]: undefined;
  [ROUTES.SETTINGS_JOIN_COMMUNITY]: undefined;

  [ROUTES.MARKDOWN_TEXT]: MarkdownTextProps;
};

const Stack = createStackNavigator<RootNavigatorParamList>();

const RootNavigator = () => {
  const initialRouteName = useMemo(() => ROUTES.DEV_SCREEN, []);
  const initWalletConnect = useInitWalletConnectClient();

  useEffect(() => {
    initWalletConnect().then(() => {
      if (__DEV__) {
        console.log('wallet connect client initialized');
      }
    });
  }, [initWalletConnect]);

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
      <Stack.Screen name={ROUTES.BROADCAST_TX} component={BroadcastTx} />

      <Stack.Screen name={ROUTES.HOME_TABS} component={HomeTabs} />

      <Stack.Screen
        name={ROUTES.WALLET_CONNECT_SESSION_PROPOSAL}
        component={WalletConnectSessionProposal}
      />

      <Stack.Screen name={ROUTES.PROFILE} component={Profile} />
      <Stack.Screen name={ROUTES.EDIT_PROFILE} component={EditProfile} />
      <Stack.Screen name={ROUTES.SEND_TOKENS} component={SendTokens} />
      <Stack.Screen name={ROUTES.CHAIN_LINK_DETAILS} component={ChainLinkDetails} />

      <Stack.Screen
        name={ROUTES.MODAL}
        component={ModalScreen}
        options={{
          presentation: 'transparentModal',
        }}
      />

      <Stack.Screen name={ROUTES.SETTINGS} component={Settings} />
      <Stack.Screen name={ROUTES.SETTINGS_DISPLAY_MODE} component={SettingsDisplayMode} />
      <Stack.Screen name={ROUTES.SETTINGS_SWITCH_CHAIN} component={SettingsSwitchChain} />
      <Stack.Screen name={ROUTES.SETTINGS_JOIN_COMMUNITY} component={SettingsJoinCommunity} />
      <Stack.Screen
        name={ROUTES.SETTINGS_CHANGE_APPLICATION_PASSWORD}
        component={SettingsChangeWalletPassword}
      />

      <Stack.Screen name={ROUTES.MARKDOWN_TEXT} component={MarkdownText} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
