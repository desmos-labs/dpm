import { CompositeNavigationProp, CompositeScreenProps } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { HomeTabsParamList } from 'navigation/RootNavigator/HomeTabs/index';

export type HomeTabsScreenProps<R extends keyof HomeTabsParamList> = CompositeScreenProps<
  BottomTabScreenProps<HomeTabsParamList, R>,
  StackScreenProps<RootNavigatorParamList>
>;

export type HomeTabsNavigationProp<R extends keyof HomeTabsParamList> = CompositeNavigationProp<
  BottomTabNavigationProp<HomeTabsParamList, R>,
  StackNavigationProp<RootNavigatorParamList>
>;
