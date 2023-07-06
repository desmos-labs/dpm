import React, { FC, useMemo } from 'react';
import ROUTES from 'navigation/routes';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from 'screens/Home';
import { useTranslation } from 'react-i18next';
import BottomBar from 'navigation/RootNavigator/HomeTabs/components/BottomBar';
import WalletConnectSessions from 'screens/WalletConnectSessions';
import AppDrawerContent from 'screens/Home/components/AppDrawer';
import AppDrawer from 'lib/AppDrawer';
import ScanQr from 'screens/ScanQr';
import { useAllWalletConnectSessionsRequests } from '@recoil/walletConnectRequests';
import ManageStaking from 'screens/ManageStaking';
import GovernanceProposals from 'screens/GovernanceProposals';
import {
  apps,
  appsGray,
  home,
  homeGray,
  iconModuleCosmWasm,
  iconModuleCosmWasmGray,
  iconModuleGovernance,
  iconModuleGovernanceGray,
  scanQRButton,
} from 'assets/images';
import TabIcon from './components/TabIcon';

export type HomeTabsParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.MANAGE_STAKING]: undefined;
  [ROUTES.SCAN_QR_CODE]: undefined;
  [ROUTES.GOVERNANCE_PROPOSALS]: undefined;
  [ROUTES.WALLET_CONNECT_SESSIONS]: undefined;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.HOME_TABS>;

const HomeBottomTabs = createBottomTabNavigator<HomeTabsParamList>();

const HomeTabs: FC<NavProps> = () => {
  const { t } = useTranslation();
  const requests = useAllWalletConnectSessionsRequests();
  const requestsCount = useMemo(() => {
    if (requests.length === 0) {
      return undefined;
    }
    return requests.length;
  }, [requests]);

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
            title: 'Home',
            tabBarIcon: ({ focused, size }) => (
              <TabIcon source={focused ? home : homeGray} size={size} />
            ),
          }}
        />
        <HomeBottomTabs.Screen
          name={ROUTES.MANAGE_STAKING}
          component={ManageStaking}
          options={{
            title: 'Stake',
            tabBarIcon: ({ focused, size }) => (
              <TabIcon source={focused ? iconModuleCosmWasm : iconModuleCosmWasmGray} size={size} />
            ),
          }}
        />
        <HomeBottomTabs.Screen
          name={ROUTES.SCAN_QR_CODE}
          component={ScanQr}
          options={{
            tabBarIcon: ({ size }) => <TabIcon source={scanQRButton} size={size} />,
          }}
        />
        <HomeBottomTabs.Screen
          name={ROUTES.GOVERNANCE_PROPOSALS}
          component={GovernanceProposals}
          options={{
            title: 'Vote',
            tabBarIcon: ({ focused, size }) => (
              <TabIcon
                source={focused ? iconModuleGovernance : iconModuleGovernanceGray}
                size={size}
              />
            ),
          }}
        />
        <HomeBottomTabs.Screen
          name={ROUTES.WALLET_CONNECT_SESSIONS}
          component={WalletConnectSessions}
          options={{
            title: 'Authorizations',
            tabBarIcon: ({ focused, size }) => (
              <TabIcon source={focused ? apps : appsGray} size={size} />
            ),
            tabBarBadge: requestsCount,
          }}
        />
      </HomeBottomTabs.Navigator>
    </AppDrawer>
  );
};

export default HomeTabs;
