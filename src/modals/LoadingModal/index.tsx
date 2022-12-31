import React from 'react';
import { View } from 'react-native';
import Typography from 'components/Typography';
import { ModalComponentProps } from 'types/navigation';
import ThemedLottieView from 'components/ThemedLottieView';
import useStyles from './useStyles';

export type SingleButtonModalParams = {
  /**
   * Modal text.
   */
  text: string;
};

const LoadingModal: React.FC<ModalComponentProps<SingleButtonModalParams>> = (props) => {
  const { params } = props;
  const styles = useStyles();

  return (
    <View>
      <ThemedLottieView
        style={styles.image}
        source="broadcast-tx"
        autoPlay
        loop
        autoSize
        resizeMode="cover"
      />
      <Typography.Body style={styles.title}>{params.text}</Typography.Body>
    </View>
  );
};

export  default LoadingModal;
