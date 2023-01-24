import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCallback } from 'react';
import { SnackBarState } from './types';

const SnackBarAtom = atom<SnackBarState>({
  key: 'snackBarState',
  default: { visible: false },
});

/**
 * Hook that provides the SnackBar app state.
 */
export const useSnackBarState = () => useRecoilValue(SnackBarAtom);

export interface SnackBarShowOptions {
  /**
   * Callback called when the snackbar is dismissed.
   */
  onDismiss?: () => any;
  /**
   * SnackBar visibility duration.
   * If is undefined will be used the SnackBar.DURATION_SHORT.
   */
  duration?: number;
}

/**
 * Hook that provide a function to display the SnackBar.
 */
export const useShowSnackBar = () => {
  const setSnackBarState = useSetRecoilState(SnackBarAtom);

  return useCallback(
    (text: string, options?: SnackBarShowOptions) => {
      // Wrap the user provided onDismiss to also hide the snack bar
      // before calling the user onDismiss callback.
      const onDismiss = () => {
        // Hide the snackbar
        setSnackBarState({
          visible: false,
        });
        // Call the user onDismiss callback.
        if (options?.onDismiss) {
          options.onDismiss();
        }
      };

      // Show the snackbar
      setSnackBarState({
        visible: true,
        duration: options?.duration,
        text,
        onDismiss,
      });
    },
    [setSnackBarState],
  );
};
