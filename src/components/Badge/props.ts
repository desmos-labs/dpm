import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export default interface BadgeProps {
  /**
   * Text to display inside the badge.
   */
  text: string;
  /**
   * True if the text inside the badge should be capitalized.
   */
  capitalize?: boolean;
  /**
   * Badge background color.
   */
  backgroundColor?: string;
  /**
   * Color of the text displayed in the badge.
   */
  textColor?: string;
  /**
   * Style that will be applied to the badge.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style that will be applied to the text.
   */
  textStyle?: StyleProp<TextStyle>;
}
