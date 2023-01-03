import { createStackNavigator } from '@react-navigation/stack';
import ROUTES from 'navigation/routes';
import React, { useMemo } from 'react';
import DevScreen from 'screens/DevScreen';

export type RootNavigatorParamList = {
  [ROUTES.DEV_SCREEN]: undefined,
  [ROUTES.LANDING]: undefined,
};

const Stack = createStackNavigator<RootNavigatorParamList>();

const RootNavigator = () => {
  const initialRouteName = useMemo(() => {
    return ROUTES.DEV_SCREEN;
  }, []);

  return <Stack.Navigator
    initialRouteName={initialRouteName}
    screenOptions={{ headerShown: false }}>
    {__DEV__ && (
      <Stack.Screen name={ROUTES.DEV_SCREEN} component={DevScreen} />
    )}
  </Stack.Navigator>;
};

export default RootNavigator;
