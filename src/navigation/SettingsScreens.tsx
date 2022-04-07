import React from 'react';
import Settings from '../screens/Settings';
import DisplayMode from '../screens/SettingsOptions/DisplayMode';
import JoinCommunity from '../screens/SettingsOptions/JoinCommunity';
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
    <SettingsScreensStack.Screen name="JoinCommunity" component={JoinCommunity} />
  </SettingsScreensStack.Navigator>
);

export default SettingsScreens;
