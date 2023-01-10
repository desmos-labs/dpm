import React, { FC } from 'react';
import ROUTES from 'navigation/routes';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from 'screens/Home';
import TabIcons from 'navigation/RootNavigator/HomeTabs/components/TabIcons';
import { useTranslation } from 'react-i18next';
import BottomBar from 'navigation/RootNavigator/HomeTabs/components/BottomBar';
import WalletConnectSessions from 'screens/WalletConnectSessions';
import AppDrawerContent from 'screens/Home/components/AppDrawer';
import AppDrawer from 'lib/AppDrawer';

export type HomeTabsParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.SCAN_QR_CODE]: undefined;
  [ROUTES.AUTHORIZATIONS]: undefined;
  [ROUTES.WALLET_CONNECT_SESSIONS]: undefined;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.HOME_TABS>;

const HomeBottomTabs = createBottomTabNavigator<HomeTabsParamList>();

const HomeTabs: FC<NavProps> = () => {
  const { t } = useTranslation();

  const tabBar = (tabBarProps: BottomTabBarProps) => {
    const currentRoute = tabBarProps.state.routes[tabBarProps.state.index];
    if (currentRoute.name === ROUTES.SCAN_QR_CODE) {
      return null;
    }
    return <BottomBar {...tabBarProps} />;
  };

  return (
    <AppDrawer renderContent={() => <AppDrawerContent />} drawerType="slide">
      <HomeBottomTabs.Navigator
        initialRouteName={ROUTES.HOME}
        screenOptions={{
          headerShown: false,
        }}
        tabBar={tabBar}
      >
        <HomeBottomTabs.Screen
          name={ROUTES.HOME}
          component={Home}
          options={{
            title: t('home'),
            tabBarIcon: TabIcons.Home,
          }}
        />
        <HomeBottomTabs.Screen
          name={ROUTES.SCAN_QR_CODE}
          component={Home}
          options={{
            tabBarIcon: TabIcons.ScanQr,
          }}
        />
        <HomeBottomTabs.Screen
          name={ROUTES.WALLET_CONNECT_SESSIONS}
          component={WalletConnectSessions}
          options={{
            title: t('authorizations'),
            tabBarIcon: TabIcons.Authorization,
          }}
        />
      </HomeBottomTabs.Navigator>
    </AppDrawer>
  );
};

export default HomeTabs;
