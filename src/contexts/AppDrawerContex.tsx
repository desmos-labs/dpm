import React, { RefObject, useCallback, useMemo } from 'react';
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

const DrawerStateContext = React.createContext<DrawerState>({
  closeDrawer(): void {},
  openDrawer(): void {},
});

export const DrawerStateProvider: React.FC<Props> = ({ children, drawerRef }) => {
  const openDrawer = useCallback(() => {
    drawerRef.current?.openDrawer();
  }, [drawerRef]);

  const closeDrawer = useCallback(() => {
    drawerRef.current?.closeDrawer();
  }, [drawerRef]);

  const drawerActions = useMemo(
    () => ({
      openDrawer,
      closeDrawer,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <DrawerStateContext.Provider value={drawerActions}>{children}</DrawerStateContext.Provider>
  );
};

export const useDrawerContext = (): DrawerState => React.useContext(DrawerStateContext);
