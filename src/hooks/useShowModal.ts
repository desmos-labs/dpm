import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback } from 'react';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { ModalComponent } from 'modals/ModalScreen';

/**
 * Hook that provide a function to display a ModalComponent.
 */
export default function useShowModal() {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  return useCallback(
    <P>(modal: ModalComponent<P>, params: P) => {
      navigation.navigate({
        name: ROUTES.MODAL,
        params: {
          component: modal,
          params,
        },
      });
    },
    [navigation],
  );
}
