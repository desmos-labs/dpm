import React, { ComponentProps } from 'react';
import { StyleProp, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { makeStyle } from '../theming';
import { Typography } from './Typography';

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
export const VerticalInput: React.FC<VerticalInputProps> = (props) => {
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

const useStyles = makeStyle((theme) => ({
  container: {
    paddingVertical: theme.spacing.s,
  },
  label: {
    paddingBottom: theme.spacing.s,
  },
  input: {
    paddingVertical: theme.spacing.s,
    borderRadius: 4,
    backgroundColor: theme.colors.surface,
    color: theme.colors.font['1'],
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: 0.0025,
    textAlign: 'left',
  },
  errorLabel: {
    color: theme.colors.error,
  },
}));

export default VerticalInput;
