import React, { ComponentProps } from 'react';
import { StyleProp, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import Typography from 'components/Typography';
import useStyles from './useStyles';

export type VerticalInputProps = Omit<ComponentProps<typeof TextInput>, 'style'> & {
  label: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  multiline?: boolean;
  error?: string;
};

/**
 This component is unfinished and not used
 */
const VerticalInput: React.FC<VerticalInputProps> = (props) => {
  const { label, style, inputStyle, error } = props;
  const styles = useStyles();
  const theme = useTheme();

  return (
    <>
      <View style={[styles.container, style]}>
        <Typography.Subtitle style={styles.label}>{label}</Typography.Subtitle>
        <TextInput
          {...props}
          style={[styles.input, inputStyle]}
          placeholderTextColor={theme.colors.font['3']}
        />
      </View>
      {error !== undefined && (
        <Typography.Caption style={styles.errorLabel}>{error}</Typography.Caption>
      )}
    </>
  );
};

export default VerticalInput;
