import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { AppState } from 'types/appState';

const appStateAtom = atom<AppState>({
  key: 'appState',
  default: {
    locked: false,
    noSplashScreen: false,
    noLockOnBackground: false,
    lastObBlur: undefined,
  },
});

/**
 * Hook that provides the current application state.
 */
export const useAppState = () => useRecoilValue(appStateAtom);

/**
 * Hook that provides a function to update the application state.
 */
export const useSetAppState = () => useSetRecoilState(appStateAtom);
