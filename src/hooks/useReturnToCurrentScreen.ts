import { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { RootNavigatorParamList } from 'navigation/RootNavigator';

export const useReturnToCurrentScreen = () => {
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  const startingScreenKey = useMemo(() => {
    const { routes } = navigator.getState();
    const currentRoute = routes[routes.length - 1];
    return currentRoute.key;
  }, [navigator]);

  const returnToCurrentScreen = useCallback(() => {
    navigator.navigate({ key: startingScreenKey });
  }, [navigator, startingScreenKey]);

  return {
    returnToCurrentScreen,
  };
};
