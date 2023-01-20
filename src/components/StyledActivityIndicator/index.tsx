import React from 'react';
import { ActivityIndicator, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface Props {
  /**
   * Additional styles
   */
  style?: StyleProp<ViewStyle>;
  /**
   * If the indicator should animate, default true
   */
  animating?: boolean;
  /**
   * If the indicator should hide when stopped
   */
  hidesWhenStopped?: boolean;
  /**
   * Size ('small' | 'large')
   */
  size?: 'small' | 'large' | undefined;
}

const StyledActivityIndicator: React.FC<Props> = (props) => {
  const theme = useTheme();

  return (
    <ActivityIndicator
      animating={props.animating}
      hidesWhenStopped={props.hidesWhenStopped}
      style={props.style}
      color={theme.colors.primary}
      size={props.size}
    />
  );
};

export default StyledActivityIndicator;
