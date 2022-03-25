import React from 'react';
import { View } from 'react-native';
import { ThemedLottieView } from '../components';
import { Typography } from '../components/typography';
import { makeStyle } from '../theming';
import { ModalComponentProps } from '../types/navigation';

export type SingleButtonModalParams = {
  /**
   * Modal text.
   */
  text: string;
};

export const LoadingModal: React.FC<ModalComponentProps<SingleButtonModalParams>> = (props) => {
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

const useStyles = makeStyle((theme) => ({
  image: {
    alignSelf: 'center',
    width: 200,
    height: 100,
  },
  title: {
    marginTop: theme.spacing.s,
    alignSelf: 'center',
  },
}));
