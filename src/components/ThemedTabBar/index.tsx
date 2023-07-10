import React from 'react';
import { TabBar } from 'react-native-tab-view';
import useStyles from './useStyles';

export type TabBarProps = React.ComponentProps<typeof TabBar>;

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
