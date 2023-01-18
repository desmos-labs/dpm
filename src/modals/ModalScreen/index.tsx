import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useCloseModal } from './useHooks';
import useStyles from './useStyles';

export type ModalComponentProps<T> = {
  params: T;
  closeModal: () => void;
};

export type ModalComponent<T> = React.FC<ModalComponentProps<T>>;

export interface ModalScreenParams {
  component: ModalComponent<any>;
  params?: any;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.MODAL>;

const ModalScreen: React.FC<NavProps> = ({ route }) => {
  const styles = useStyles();
  const { component, params } = route.params;
  const closeModal = useCloseModal();
  const ModalContent = component;

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <ModalContent params={params} closeModal={closeModal} />
      </View>
    </View>
  );
};

export default ModalScreen;
