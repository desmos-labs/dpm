import { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { ModalScreenParams } from 'modals/ModalScreen';
import LoadingModal from 'modals/LoadingModal';

/**
 * List of modal component that we should ignore when going back.
 */
const ToIgnoreModals = [LoadingModal];

const useReturnToCurrentScreen = () => {
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  const startingScreenNavigateParams = useMemo(() => {
    const { routes } = navigator.getState() ?? { routes: [] };
    // Handle the case where we default to the empty routes in case
    // this hook is called while the navigator instance is not ready.
    if (routes.length === 0) {
      return undefined;
    }

    let currentRoute = routes[routes.length - 1];

    // Check if the screen that we should return to is one of the modal that we
    // need to ignore, in this case we should go back to the screen that opened that modal.
    const modalParams = <Partial<ModalScreenParams> | undefined>currentRoute.params;
    if (ToIgnoreModals.find((modalComponent) => modalParams?.component === modalComponent)) {
      currentRoute = routes[routes.length - 2];
    }

    return { key: currentRoute.key, params: currentRoute.params };
    // Safe to ignore we want the current screen when we call this hook and
    // not each time the navigator instance changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useCallback(() => {
    const canNavigate =
      startingScreenNavigateParams !== undefined &&
      navigator.getState().routes.find((r) => r.key === startingScreenNavigateParams.key) !==
        undefined;
    if (canNavigate) {
      navigator.navigate(startingScreenNavigateParams);
    }
  }, [navigator, startingScreenNavigateParams]);
};

export default useReturnToCurrentScreen;
