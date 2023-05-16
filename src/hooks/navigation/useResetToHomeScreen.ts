import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import React from 'react';
import ROUTES from 'navigation/routes';

/**
 * Hook that provides a function to reset the navigation
 * back to the home screen.
 */
const useResetToHomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootNavigatorParamList>>();

  return React.useCallback(() => {
    if (__DEV__) {
      // When in dev mode add also the DEV_SCREEN to the navigation routes so
      // we can go back from the home to the dev screen.
      navigation.reset({
        index: 1,
        routes: [{ name: ROUTES.DEV_SCREEN }, { name: ROUTES.HOME_TABS }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: ROUTES.HOME_TABS }],
      });
    }
  }, [navigation]);
};

export default useResetToHomeScreen;
