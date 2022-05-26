import React from 'react';
import Settings from '../screens/Settings';
import ChangeWalletPassword from '../screens/SettingsOptions/ChangeWalletPassword';
import DisplayMode from '../screens/SettingsOptions/DisplayMode';
import HandleBiometrics from '../screens/SettingsOptions/HandleBiometrics';
import JoinCommunity from '../screens/SettingsOptions/JoinCommunity';
import SwitchChain from '../screens/SettingsOptions/SwitchChain';
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
