import React from 'react';
import { View } from 'react-native';
import Typography from 'components/Typography';
import { ModalComponentProps } from 'modals/ModalScreen';
import useStyles from './useStyles';

type TextModalParams = {
  /**
   * Modal title.
   */
  title: string;
  /**
   * Modal text.
   */
  message: string;
};

const TextModal: React.FC<ModalComponentProps<TextModalParams>> = (props) => {
  const { params } = props;
  const styles = useStyles();

  return (
    <View>
      <Typography.H6 style={styles.title}>{params.title}</Typography.H6>
      <Typography.Regular16 style={styles.message}>{params.message}</Typography.Regular16>
    </View>
  );
};

export default TextModal;
