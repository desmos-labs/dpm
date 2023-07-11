import React from 'react';
import { TabBar } from 'react-native-tab-view';
import useStyles from './useStyles';

export type TabBarProps = React.ComponentProps<typeof TabBar>;

/**
 * TabBar component that can be used in the TabView
 * component.
 * This component have the same layout of the default TabView
 * tab bar but will use the application theme colors.
 */
const ThemedTabBar: React.FC<TabBarProps> = (tabBarProps) => {
  const styles = useStyles();
  return (
    <TabBar
      {...tabBarProps}
      style={styles.root}
      indicatorStyle={styles.indicator}
      labelStyle={styles.label}
    />
  );
};

export default ThemedTabBar;
