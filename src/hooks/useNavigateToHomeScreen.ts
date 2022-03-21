import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import {
	HomeScreensBottomTabsParams,
	RootStackParams,
} from '../types/navigation';

export type HomeNavigationParmas = {
	/**
	 * True if all screen history should be deleted.
	 * default: false.
	 */
	reset?: boolean;
	/**
	 * The tab to be opened on the Home.
	 * default: Home
	 */
	tab?: keyof HomeScreensBottomTabsParams;
};

export default function useNavigateToHomeScreen() {
	const navigation = useNavigation<StackNavigationProp<RootStackParams>>();

	return useCallback(
		(params: HomeNavigationParmas) => {
			const { reset, tab }: HomeNavigationParmas = {
				reset: false,
				tab: 'Home',
				...params,
			};
			if (reset === true) {
				const state = navigation.getState();
				const key = state?.routes.find((r) => r.name === 'AccountScreens')?.key;
				navigation.reset({
					index: 0,
					routes: [
						{
							name: 'AccountScreens',
							params: {
								screen: 'HomeScreens',
								params: {
									screen: tab,
									params: undefined,
								},
							},
							key,
						},
					],
				});
			} else {
				navigation.navigate({
					name: 'AccountScreens',
					params: {
						screen: 'HomeScreens',
						params: {
							screen: tab,
							params: undefined,
						},
					},
				});
			}
		},
		[navigation]
	);
}
