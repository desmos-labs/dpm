import React from 'react';
import { StyleSheet, View } from 'react-native';

type PaddingProps = {
  /**
   * Flex value used to generate the padding area.
   */
  flex: number;
};

const Padding: React.FC<PaddingProps> = ({ flex }) => {
  const style = StyleSheet.create({
    padding: {
      flex,
    },
  });
  return <View style={style.padding} />;
};

export default Padding;
