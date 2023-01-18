import { useNavigation } from '@react-navigation/native';
import { useCallback, useMemo } from 'react';

/**
 * Hook that provide a function to close the modal.
 */
export const useCloseModal = () => {
  const navigation = useNavigation();
  const navigateParams = useMemo(() => {
    const state = navigation.getState();
    const previousRoute = state.routes[state.routes.length - 2];
    return {
      key: previousRoute.key,
      params: previousRoute.params,
    };
  }, [navigation]);

  return useCallback(() => {
    navigation.navigate(navigateParams);
  }, [navigation, navigateParams]);
};
