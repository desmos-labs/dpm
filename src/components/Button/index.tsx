import React from 'react';
import { Button as MaterialButton, useTheme } from 'react-native-paper';
import useStyles from './useStyles';
import ButtonProps from './props';

const Button: React.FC<ButtonProps> = (props) => {
  const {
    mode,
    color,
    icon,
    onPress,
    labelStyle,
    loading,
    disabled,
    accent,
    contentStyle,
    style,
    children,
  } = props;
  const theme = useTheme();
  const styles = useStyles(props);
  const accentColor = accent ? theme.colors.accent : theme.colors.primary;
  return (
    <MaterialButton
      icon={icon}
      color={color || accentColor}
      onPress={onPress}
      mode={mode}
      labelStyle={[styles.labelStyle, labelStyle]}
      style={[styles.btnStyle, style]}
      contentStyle={[styles.contentStyle, contentStyle]}
      loading={loading}
      disabled={disabled}
    >
      {children}
    </MaterialButton>
  );
};

export default Button;
