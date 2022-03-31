import React, { ComponentProps } from 'react';
import { StyleProp, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { makeStyle } from '../theming';
import { Typography } from './typography';

type InlineInputProps = Omit<ComponentProps<typeof TextInput>, 'style'> & {
  label: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  error?: string;
};

const InlineInput: React.FC<InlineInputProps> = (props) => {
  const { label, style, inputStyle, error } = props;
  const styles = useStyles();

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <View style={[styles.container, style]}>
        <Typography.Subtitle style={styles.label}>{label}</Typography.Subtitle>
        <TextInput {...props} style={[styles.input, inputStyle]} textAlignVertical="top" />
      </View>
      {error !== undefined && (
        <Typography.Caption style={styles.errorLabel}>{error}</Typography.Caption>
      )}
    </View>
  );
};

const useStyles = makeStyle((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 4,
  },
  label: {
    flex: 3,
    paddingTop: 8,
  },
  input: {
    flex: 7,
    paddingTop: 8,
    paddingBottom: 0,
    color: theme.colors.font['1'],
  },
  errorLabel: {
    color: theme.colors.error,
  },
}));

export default InlineInput;
