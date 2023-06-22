import { DependencyList, useCallback, useEffect, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';
import useOnBackAction from './useOnBackAction';

/**
 * Hook that execute the provided callback when the screen detaches.
 * @param onDetach - Callback called when the screen is detached.
 * @param deps - Deps that are used inside the {@param onDetach} callback.
 */
const useOnScreenDetached = (onDetach: () => any, deps: DependencyList) => {
  const backActionStateRef = useRef(false);
  const isFocused = useIsFocused();
  // Safe to ignore the onDetach value since we want to memoize the provided
  // onDetach function using the provided deps list.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedDetachCallback = useCallback(onDetach, [...deps]);

  useOnBackAction(() => {
    backActionStateRef.current = true;
  }, [backActionStateRef]);

  useEffect(
    () => () => {
      if (!isFocused && backActionStateRef.current) {
        memoizedDetachCallback();
      }
    },
    [isFocused, backActionStateRef, memoizedDetachCallback],
  );
};

export default useOnScreenDetached;
