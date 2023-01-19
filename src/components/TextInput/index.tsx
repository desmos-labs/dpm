import React, { MutableRefObject } from 'react';
import { StyleProp, TextInput as NativeTextInput, TextStyle, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import useStyles from './useStyles';

export type TextInputProps = Omit<React.ComponentProps<typeof NativeTextInput>, 'style'> & {
  /**
   * If true highlight the input field to
   * signal to the user that the current value
   * is not valid.
   */
  error?: boolean;
  /**
   * Element to show on the right side of the
   * input area.
   */
  rightElement?: React.ReactNode | null;
  inputRef?: MutableRefObject<NativeTextInput | null>;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

const TextInput: React.FC<TextInputProps> = (props) => {
  const { rightElement, style, inputRef, inputStyle } = props;
  const styles = useStyles(props);
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <NativeTextInput
        ref={inputRef}
        {...props}
        style={[styles.input, inputStyle]}
        placeholderTextColor={theme.colors.font['3']}
      />
      <View style={styles.right}>{rightElement}</View>
    </View>
  );
};

export default TextInput;
