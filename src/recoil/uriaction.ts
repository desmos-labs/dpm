import { atom, useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
import { UriAction } from 'types/uri';

/**
 * Atom that contains the {@link UriAction} that the application
 * should handle.
 */
const uriActionAtom = atom<UriAction | undefined>({
  key: 'uriActionAppState',
  default: undefined,
});

/**
 * Hook that provides the current {@link UriAction} that need to be handled.
 */
export const useUriAction = () => useRecoilValue(uriActionAtom);

/**
 * Hook that provides the setter for the {@link UriAction} that need to be handled.
 */
export const useSetUriAction = () => useSetRecoilState(uriActionAtom);

/**
 * Hook that provides a function to get the curret {@link UriAction}.
 */
export const useGetUriAction = () =>
  useRecoilCallback(
    ({ snapshot }) =>
      async () =>
        snapshot.getPromise(uriActionAtom),
  );
