import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { RootNavigatorParamList } from 'navigation/RootNavigator';

const useBackOnFocus = (callback: () => any) => {
  const isFocused = useIsFocused();
  const [focusCount, setFocusCount] = useState(0);

  useEffect(() => {
    if (focusCount === 2) {
      callback();
    } else if (isFocused) {
      setFocusCount((old) => old + 1);
    }
  }, [callback, isFocused, focusCount]);
};

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
