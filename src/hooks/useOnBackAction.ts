import { DependencyList, useCallback, useEffect } from 'react';
import { EventArg, useNavigation } from '@react-navigation/native';

type CallbackArg = EventArg<'beforeRemove', true, { action: { type: string } }>;
type BackCallback = (event: CallbackArg) => any | (() => any);

/**
 * Hook that execute the provided callback when the user go back from the current screen.
 * @param onBack - Callback called when the user press the back button.
 * @param deps - Deps that are used inside the {@param onBack} callback.
 */
const useOnBackAction = (onBack: BackCallback, deps: DependencyList) => {
  const navigation = useNavigation();
  const beforeRemoveListener = useCallback(
    (e: CallbackArg) => {
      if (e.data.action.type === 'GO_BACK') {
        onBack(e);
      }
    },
    [onBack, ...deps],
  );

  useEffect(() => {
    navigation.addListener('beforeRemove', beforeRemoveListener);
    return () => {
      navigation.removeListener('beforeRemove', beforeRemoveListener);
    };
  }, [navigation, beforeRemoveListener]);
};

export default useOnBackAction;
