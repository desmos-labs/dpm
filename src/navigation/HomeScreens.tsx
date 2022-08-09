import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from 'react-native';
import { DesmosIcon } from '../components';
import { AppDrawer } from '../components/AppDrawer/AppDrawer';
import { AppDrawerContent } from '../components/AppDrawer/AppDrawerContent';
import HomeScreenBottomBar from '../components/HomeScreenBottomBar';
import { Authorization } from '../screens/Authorization';
import { Home } from '../screens/Home';
import { ScanQr } from '../screens/ScanQr';
import {
  AccountScreensStackParams,
  HomeScreensBottomTabs,
  RootStackParams,
} from '../types/navigation';

type HomeScreensProps = CompositeScreenProps<
  StackScreenProps<RootStackParams>,
  StackScreenProps<AccountScreensStackParams, 'HomeScreens'>
>;

const HomeScreens: React.FC<HomeScreensProps> = (props) => {
  const { t } = useTranslation();
  const { navigation } = props;

  const tabBar = (tabBarProps: BottomTabBarProps) => {
    const currentRoute = tabBarProps.state.routes[tabBarProps.state.index];
    if (currentRoute.name === 'ScanQr') {
      return null;
    }
    return <HomeScreenBottomBar {...tabBarProps} />;
  };

  const homeIcon = (size: number, color: string) => (
    <DesmosIcon name="home" size={size} color={color} />
  );

  const authIcon = (size: number, color: string) => (
    <DesmosIcon name="authorization" size={size} color={color} />
  );

  const scanQrIcon = (size: number) => (
    <Image
      style={{ width: size, height: size }}
      resizeMode="contain"
      source={require('../assets/scan-qr-button.png')}
    />
  );

  return (
    <AppDrawer
      renderContent={() => <AppDrawerContent navigation={navigation} />}
      drawerType="slide"
    >
      <HomeScreensBottomTabs.Navigator
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(tabBarProps) => tabBar(tabBarProps)}
      >
        <HomeScreensBottomTabs.Screen
          name="Home"
          component={Home}
          options={{
            title: t('home'),
            tabBarIcon: ({ color, size }) => homeIcon(size, color),
          }}
        />
        <HomeScreensBottomTabs.Screen
          name="ScanQr"
          component={ScanQr}
          options={{
            tabBarIcon: ({ size }) => scanQrIcon(size),
          }}
        />
        <HomeScreensBottomTabs.Screen
          name="Authorization"
          component={Authorization}
          options={{
            title: t('authorization'),
            tabBarIcon: ({ color, size }) => authIcon(size, color),
          }}
        />
      </HomeScreensBottomTabs.Navigator>
    </AppDrawer>
  );
};

export default HomeScreens;
