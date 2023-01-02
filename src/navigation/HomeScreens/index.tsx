import React from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { Image } from 'react-native';
import { Authorization } from 'screens/Authorization';
import { Home } from 'screens/Home';
import { ScanQr } from 'screens/ScanQr';
import {
  AccountScreensStackParams,
  HomeScreensBottomTabs,
  RootStackParams,
} from 'types/navigation';
import DesmosIcon from 'components/DesmosIcon';
import BottomBar from './components/BottomBar';
import AppDrawer from './components/AppDrawer';
import AppDrawerContent from './components/AppDrawerContent';

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
    return <BottomBar {...tabBarProps} />;
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
      source={require('assets/images/scanQRButton.png')}
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
