import { DependencyList, useCallback, useEffect, useMemo } from 'react';
import { EventArg, useNavigation } from '@react-navigation/native';

type CallbackArg = EventArg<'beforeRemove', true, { action: { type: string; source?: string } }>;
type BackCallback = (event: CallbackArg) => any | (() => any);

/**
 * Hook that execute the provided callback when the user go back from the current screen.
 * @param onBack - Callback called when the user press the back button.
 * @param deps - Deps that are used inside the {@param onBack} callback.
 */
const useOnBackAction = (onBack: BackCallback, deps: DependencyList) => {
  const navigation = useNavigation();
  const memoizedBackCallback = useCallback(onBack, [...deps, onBack]);

  const currentScreen = useMemo(() => {
    const { routes } = navigation.getState();
    return routes[routes.length - 1];
  }, [navigation]);

  const beforeRemoveListener = useCallback(
    (e: CallbackArg) => {
      // Call the back action only when the go back action source is the current screen,
      // this is to prevent executing the callback when is another screen that
      // originated the event.
      if (e.data.action.type === 'GO_BACK' && e.target === currentScreen.key) {
        memoizedBackCallback(e);
      }
    },
    [currentScreen, memoizedBackCallback],
  );

  useEffect(() => {
    navigation.addListener('beforeRemove', beforeRemoveListener);
    return () => {
      navigation.removeListener('beforeRemove', beforeRemoveListener);
    };
  }, [navigation, beforeRemoveListener]);
};

export default useOnBackAction;
