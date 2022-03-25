import React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Button as MaterialButton, useTheme } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { makeStyleWithProps } from '../theming';

export type Props = {
  /**
   * Mode of the button. You can change the mode to adjust the styling to give it desired emphasis.
   * - `text` - flat button without background or outline (low emphasis)
   * - `outlined` - button with an outline (medium emphasis)
   * - `contained` - button with a background color and elevation shadow (high emphasis)
   */
  mode?: 'text' | 'outlined' | 'contained';
  /**
   * Custom text color for flat button,
   * or background color for contained button.
   */
  color?: string;
  /**
   * Icon to display for the `Button`.
   */
  icon?: IconSource;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * Style for the button text.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Whether to show a loading indicator.
   */
  loading?: boolean;
  /**
   * Whether the button is disabled.
   * A disabled button is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean;
  /**
   * If tru display the button with the accent color from the current1 theme.
   */
  accent?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

export const Button: React.FC<Props> = (props) => {
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

const useStyles = makeStyleWithProps((props: Props, theme) => {
  const accent = props.accent ? theme.colors.accent : theme.colors.primary;
  const color = props.color ? props.color : accent;
  return {
    labelStyle: {
      fontFamily: 'Poppins-Medium',
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.0125,
      color: props.mode === 'contained' ? theme.colors.font['5'] : color,
      textTransform: 'capitalize',
    },
    btnStyle: {
      borderColor: color,
      borderWidth: props.mode === 'outlined' ? 1 : 0,
      elevation: 0,
    },
    contentStyle: {
      height: 42,
    },
  };
});
