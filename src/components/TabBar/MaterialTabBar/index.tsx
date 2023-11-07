import React from 'react';
import {
  MaterialTabBar as LibTabBar,
  MaterialTabBarProps,
} from 'react-native-collapsible-tab-view';
import { useTheme } from 'react-native-paper';
import StyledMaterialTabItem from './TabItem';

function StyledMaterialTabBar(props: MaterialTabBarProps<string>) {
  const theme = useTheme();

  return (
    <LibTabBar
      indicatorStyle={{ backgroundColor: theme.colors.primary }}
      TabItemComponent={StyledMaterialTabItem}
      {...props}
    />
  );
}

export default StyledMaterialTabBar;
