import React from 'react';
import Settings from '../screens/Settings/Settings';
import ChangeWalletPassword from '../screens/Settings/components/ChangeWalletPassword';
import DisplayMode from '../screens/Settings/components/DisplayMode';
import HandleBiometrics from '../screens/Settings/components/HandleBiometrics';
import JoinCommunity from '../screens/Settings/components/JoinCommunity';
import SwitchChain from '../screens/Settings/components/SwitchChain';
import { SettingsScreensStack } from '../types/navigation';

const SettingsScreens: React.FC = () => (
  <SettingsScreensStack.Navigator
    initialRouteName="Settings"
    screenOptions={{
      headerShown: false,
    }}
  >
    <SettingsScreensStack.Screen name="Settings" component={Settings} />
    <SettingsScreensStack.Screen name="DisplayMode" component={DisplayMode} />
    <SettingsScreensStack.Screen name="SwitchChain" component={SwitchChain} />
    <SettingsScreensStack.Screen name="JoinCommunity" component={JoinCommunity} />
    <SettingsScreensStack.Screen name="CheckOldPassword" component={ChangeWalletPassword} />
    <SettingsScreensStack.Screen name="CreateNewPassword" component={ChangeWalletPassword} />
    <SettingsScreensStack.Screen name="HandleBiometrics" component={HandleBiometrics} />
  </SettingsScreensStack.Navigator>
);

export default SettingsScreens;
