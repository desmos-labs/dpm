import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

interface ButtonProps {
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
  style?: StyleProp<ViewStyle> & { color?: string };
}

export default ButtonProps;
