import React, { RefObject, useCallback } from 'react';
import { DrawerLayout } from 'react-native-gesture-handler';

export interface DrawerState {
	/**
	 * Open the drawer.
	 */
	openDrawer(): void;

	/**
	 * Close the drawer
	 */
	closeDrawer(): void;
}

type Props = {
	drawerRef: RefObject<DrawerLayout | undefined>;
};

// @ts-ignore
const DrawerState = React.createContext<DrawerState>({});

export const DrawerStateProvider: React.FC<Props> = ({
	children,
	drawerRef,
}) => {
	const openDrawer = useCallback(() => {
		drawerRef.current?.openDrawer();
	}, [drawerRef]);

	const closeDrawer = useCallback(() => {
		drawerRef.current?.closeDrawer();
	}, [drawerRef]);

	return (
		<DrawerState.Provider
			value={{
				openDrawer,
				closeDrawer,
			}}
		>
			{children}
		</DrawerState.Provider>
	);
};

export const useDrawerContext = (): DrawerState =>
	React.useContext(DrawerState);
