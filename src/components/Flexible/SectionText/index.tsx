import React from 'react';
import { View } from 'react-native';
import Typography from '../../Typography';
import useStyles from './useStyles';

type Props = {
  label: string;
  value: string;
};

const SectionText: React.FC<Props> = (props) => {
  const { label, value } = props;
  const styles = useStyles();

  return (
    <View style={styles.root}>
      <Typography.Body1 style={styles.label}>{label}</Typography.Body1>
      <Typography.Body1 style={styles.value}>{value}</Typography.Body1>
    </View>
  );
};

export default SectionText;
