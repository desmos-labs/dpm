import React from 'react';
import { Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { CompositeScreenProps } from '@react-navigation/native';
import {
	AccountScreensStackParams,
	HomeScreensBottomTabs,
	RootStackParams,
} from '../types/navigation';
import { Authorization } from '../screens/Authorization';
import { ScanQr } from '../screens/ScanQr';
import { HomeScreenBottomBar } from '../components/HomeScreenBottomBar';
import { DesmosIcon } from '../components';
import { AppDrawerContent } from '../components/AppDrawerContent';
import { Home } from '../screens/Home';
import { AppDrawer } from '../components/AppDrawer';

type HomeScreensProps = CompositeScreenProps<
	StackScreenProps<AccountScreensStackParams, 'HomeScreens'>,
	StackScreenProps<RootStackParams>
>;

const HomeScreens: React.FC<HomeScreensProps> = (props) => {
	const { t } = useTranslation();
	const { navigation } = props;

	return (
		<AppDrawer
			renderContent={() => <AppDrawerContent navigation={navigation} />}
			drawerType="slide"
		>
			<HomeScreensBottomTabs.Navigator
				screenOptions={{
					headerShown: false,
				}}
				tabBar={(tabBarProps) => {
					const currentRoute =
						tabBarProps.state.routes[tabBarProps.state.index];
					if (currentRoute.name === 'ScanQr') {
						return null;
					}
					return <HomeScreenBottomBar {...tabBarProps} />;
				}}
			>
				<HomeScreensBottomTabs.Screen
					name="Home"
					component={Home}
					options={{
						title: t('profile'),
						tabBarIcon: ({ color, size }) => {
							return <DesmosIcon name="profile" size={size} color={color} />;
						},
					}}
				/>
				<HomeScreensBottomTabs.Screen
					name="ScanQr"
					component={ScanQr}
					options={{
						tabBarIcon: ({ size }) => (
							<Image
								style={{ width: size, height: size }}
								resizeMode="contain"
								source={require('../assets/scan-qr-button.png')}
							/>
						),
					}}
				/>
				<HomeScreensBottomTabs.Screen
					name="Authorization"
					component={Authorization}
					options={{
						title: t('authorization'),
						tabBarIcon: ({ color, size }) => {
							return (
								<DesmosIcon name="authorization" size={size} color={color} />
							);
						},
					}}
				/>
			</HomeScreensBottomTabs.Navigator>
		</AppDrawer>
	);
};

export default HomeScreens;
