import React from 'react';
import { View } from 'react-native';
import useStyles from './useStyles';

export const ListItemSeparator: React.FC = () => {
  const styles = useStyles();
  return <View style={styles.separator} />;
};

export default ListItemSeparator;
