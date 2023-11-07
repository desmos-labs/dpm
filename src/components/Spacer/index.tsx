import React from 'react';
import { View } from 'react-native';

type Props = {
  children?: React.ReactNode;
  padding?: number | string | undefined;
  paddingBottom?: number | string | undefined;
  paddingHorizontal?: number | string | undefined;
  paddingLeft?: number | string | undefined;
  paddingRight?: number | string | undefined;
  paddingTop?: number | string | undefined;
  paddingVertical?: number | string | undefined;
};

/**
 * HOC that wraps a child component with optional padding to create space
 * between sibling components.
 */
const Spacer = ({ children, ...rest }: Props) => (
  <View style={rest} pointerEvents="none">
    {children}
  </View>
);

export default Spacer;
