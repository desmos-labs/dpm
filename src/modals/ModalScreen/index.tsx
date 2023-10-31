import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import DKeyboardAvoidingView from 'components/DKeyboardAvoidingView';
import { useCloseModal } from './useHooks';
import useStyles from './useStyles';

export type ModalComponentProps<T> = {
  params: T;
  closeModal: () => void;
};

export type ModalComponent<T> = React.FC<ModalComponentProps<T>>;

/**
 * Modal visualization mode.
 */
export enum ModalMode {
  /**
   * Show the modal content in the center of the screen.
   */
  Centred,
  /**
   * Show the content of the modal at the bottom of
   * the screen.
   */
  BottomSheet,
}

/**
 * Interface that represents the modal configurations.
 */
export interface ModalConfig {
  /**
   * Mode that tells how the modal content should be displayed.
   * If undefined will default to `ModalMode.Centred`.
   */
  readonly mode?: ModalMode;
  /**
   * If true prevent the user to close the modal using
   * the back action.
   */
  readonly blockGoBack?: boolean;
}

export interface ModalScreenParams {
  component: ModalComponent<any>;
  params?: any;
  config?: ModalConfig;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.MODAL>;

const ModalScreen: React.FC<NavProps> = ({ route, navigation }) => {
  const { component, params, config } = route.params;
  const styles = useStyles();
  const closeModal = useCloseModal();
  const ModalContent = component;

  // -------- VARIABLE -------

  const mode = React.useMemo(() => config?.mode ?? ModalMode.Centred, [config]);

  // -------- STYLES --------

  const rootStyles = React.useMemo(() => {
    switch (mode) {
      case ModalMode.BottomSheet:
        return [styles.root, styles.bottomRoot];
      case ModalMode.Centred:
      default:
        return [styles.root, styles.centredRoot];
    }
  }, [styles, mode]);

  const contentStyle = React.useMemo(() => {
    switch (mode) {
      case ModalMode.BottomSheet:
        return [styles.content, styles.bottomContent];
      case ModalMode.Centred:
      default:
        return [styles.content, styles.centredContent];
    }
  }, [styles, mode]);

  // -------- EFFECTS --------

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (
          e.data.action.type === 'GO_BACK' &&
          e.target === route.key &&
          config?.blockGoBack === true
        ) {
          e.preventDefault();
        }
      }),
    [navigation, config?.blockGoBack, route.key],
  );

  return (
    <View style={rootStyles}>
      {/*
       * Touchable opacity that will fill the upper part of the modal
       * so that the use can close the popup touching on the outside area
       * when displaying the content on the bottom part of the screen.
       */}
      {mode === ModalMode.BottomSheet ? (
        <TouchableOpacity onPress={closeModal} style={styles.closePopupArea} />
      ) : null}

      <DKeyboardAvoidingView style={contentStyle} keyboardVerticalOffset={0}>
        <ModalContent params={params} closeModal={closeModal} />
      </DKeyboardAvoidingView>
    </View>
  );
};

export default ModalScreen;
