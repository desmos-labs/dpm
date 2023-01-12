import React from 'react';
import Settings from 'screens/Settings';
import ChangeWalletPassword from 'screens/ChangeWalletPassword';
import SettingsDisplayMode from 'screens/SettingsDisplayMode';
import HandleBiometrics from 'screens/HandleBiometrics';
import JoinCommunity from 'screens/JoinCommunity';
import SettingsSwitchChain from 'screens/SettingsSwitchChain';
import { SettingsScreensStack } from 'types/navigation';

const SettingsScreens: React.FC = () => (
  <SettingsScreensStack.Navigator
    initialRouteName="Settings"
    screenOptions={{
      headerShown: false,
    }}
  >
    <SettingsScreensStack.Screen name="Settings" component={Settings} />
    <SettingsScreensStack.Screen name="DisplayMode" component={SettingsDisplayMode} />
    <SettingsScreensStack.Screen name="SwitchChain" component={SettingsSwitchChain} />
    <SettingsScreensStack.Screen name="JoinCommunity" component={JoinCommunity} />
    <SettingsScreensStack.Screen name="CheckOldPassword" component={ChangeWalletPassword} />
    <SettingsScreensStack.Screen name="CreateNewPassword" component={ChangeWalletPassword} />
    <SettingsScreensStack.Screen name="HandleBiometrics" component={HandleBiometrics} />
  </SettingsScreensStack.Navigator>
);

export default SettingsScreens;
