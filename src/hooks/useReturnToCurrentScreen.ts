import { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { RootNavigatorParamList } from 'navigation/RootNavigator';

export const useReturnToCurrentScreen = () => {
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  const startingScreenNavigateParams = useMemo(() => {
    const { routes } = navigator.getState();
    const currentRoute = routes[routes.length - 1];
    return { key: currentRoute.key, params: currentRoute.params };
  }, [navigator]);

  const returnToCurrentScreen = useCallback(() => {
    navigator.navigate(startingScreenNavigateParams);
  }, [navigator, startingScreenNavigateParams]);

  return {
    returnToCurrentScreen,
  };
};
