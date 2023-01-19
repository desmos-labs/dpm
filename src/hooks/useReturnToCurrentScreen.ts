import { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { RootNavigatorParamList } from 'navigation/RootNavigator';

const useReturnToCurrentScreen = () => {
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  const startingScreenNavigateParams = useMemo(() => {
    const { routes } = navigator.getState();
    const currentRoute = routes[routes.length - 1];
    return { key: currentRoute.key, params: currentRoute.params };
  }, [navigator]);

  return useCallback(() => {
    navigator.navigate(startingScreenNavigateParams);
  }, [navigator, startingScreenNavigateParams]);
};

export default useReturnToCurrentScreen;
