import { DependencyList, useCallback, useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import useOnBackAction from './useOnBackAction';

/**
 * Hook that execute the provided callback when the screen detaches.
 * @param onDetach - Callback called when the screen is detached.
 * @param deps - Deps that are used inside the {@param onDetach} callback.
 */
const useOnScreenDetached = (onDetach: () => any, deps: DependencyList) => {
  const [backActionReceived, setBackActionReceived] = useState(false);
  const isFocused = useIsFocused();
  const memoizedDetachCallback = useCallback(onDetach, deps);

  useOnBackAction(() => {
    setBackActionReceived(true);
  }, []);

  useEffect(
    () => () => {
      if (!isFocused && backActionReceived) {
        memoizedDetachCallback();
      }
    },
    [isFocused, backActionReceived, memoizedDetachCallback],
  );
};

export default useOnScreenDetached;
