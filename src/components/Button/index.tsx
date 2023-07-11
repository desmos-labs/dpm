import React from 'react';
import { Button as MaterialButton, useTheme } from 'react-native-paper';
import useStyles from './useStyles';
import ButtonProps from './props';

/**
 * Component that shows a button that follows the application styles and theme.
 */
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

  // -------- VARIABLES --------

  const btnColor = React.useMemo(() => {
    if (color) {
      return color;
    }

    if (style?.color) {
      return style.color;
    }

    if (disabled) {
      return theme.colors.button.disabled;
    }

    return accent ? theme.colors.button.secondary : theme.colors.button.primary;
  }, [
    color,
    style?.color,
    disabled,
    accent,
    theme.colors.button.secondary,
    theme.colors.button.primary,
    theme.colors.button.disabled,
  ]);

  return (
    <MaterialButton
      icon={icon}
      color={btnColor}
      onPress={disabled ? undefined : onPress}
      mode={mode}
      labelStyle={[styles.labelStyle, labelStyle]}
      style={[styles.btnStyle, style]}
      contentStyle={[styles.contentStyle, contentStyle]}
      loading={loading}
    >
      {children}
    </MaterialButton>
  );
};

export default Button;
