import React from 'react';
import { useTranslation } from 'react-i18next';
import EditProfile from 'screens/EditProfile';
import BiographyEditor from 'screens/BiographyEditor';
import ChainLinkDetails from 'screens/ChainLinkDetails';
import ConfirmProfileEdit from 'screens/ConfirmProfileEdit';
import ConfirmTx from 'screens/ConfirmTx';
import SendTokens from 'screens/SendTokens';
import TransactionDetails from 'components/TransactionDetails';
import WalletConnectCallRequest from 'screens/WalletConnectCallRequest';
import { AccountScreensStack } from 'types/navigation';
import AuthorizeOperation from 'screens/AuthorizeOperation';
import AuthorizeSession from 'screens/AuthorizeSession';
import Profile from 'screens/Profile';
import useHandleCallRequests from 'hooks/useHandleCallRequests';
import ChainLinkScreens from '../ChainLinkScreens';
import HomeScreens from '../HomeScreens';
import SettingsScreens from '../SettingsScreens';

export default function AccountScreens() {
  const { t } = useTranslation();

  useHandleCallRequests();

  return (
    <AccountScreensStack.Navigator
      initialRouteName="HomeScreens"
      screenOptions={{
        headerShown: false,
      }}
    >
      <AccountScreensStack.Screen name="HomeScreens" component={HomeScreens} />
      <AccountScreensStack.Screen name="Profile" component={Profile} />
      <AccountScreensStack.Screen name="EditProfile" component={EditProfile} />
      <AccountScreensStack.Screen name="BiographyEditor" component={BiographyEditor} />
      <AccountScreensStack.Screen name="ConfirmProfileEdit" component={ConfirmProfileEdit} />
      <AccountScreensStack.Screen
        name="AuthorizeSession"
        options={{
          title: t('new session'),
        }}
        component={AuthorizeSession}
      />
      <AccountScreensStack.Screen name="SendToken" component={SendTokens} />
      <AccountScreensStack.Screen name="ConfirmTx" component={ConfirmTx} />
      <AccountScreensStack.Screen name="TxDetails" component={TransactionDetails} />
      <AccountScreensStack.Screen
        name="AuthorizeOperation"
        options={{
          presentation: 'transparentModal',
        }}
        component={AuthorizeOperation}
      />
      <AccountScreensStack.Screen name="ChainLinkScreens" component={ChainLinkScreens} />
      <AccountScreensStack.Screen
        name="WalletConnectCallRequest"
        component={WalletConnectCallRequest}
      />
      <AccountScreensStack.Screen
        name="ChainLinkDetails"
        component={ChainLinkDetails}
        options={{
          presentation: 'transparentModal',
        }}
      />
      <AccountScreensStack.Screen name="SettingsScreens" component={SettingsScreens} />
    </AccountScreensStack.Navigator>
  );
}
