import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

/**
 * Recoil that holds a boolean flag that tells if the home should
 * be refreshed.
 * NOTE: This is a workaround to force the home refresh until we have
 * a proper cache in place that can be updated after an operation that
 * affect the data displayed in the Home screen has been performed
 */
const homeShouldReloadData = atom<boolean>({
  key: 'homeShouldReloadData',
  default: false,
});

/**
 * Hook that tels if the home should refresh the displayed data.
 */
export const useHomeShouldReloadData = () => useRecoilValue(homeShouldReloadData);

/**
 * Hook that provides a function to update the value of the refresh home flag.
 */
export const useSetHomeShouldReloadData = () => useSetRecoilState(homeShouldReloadData);
