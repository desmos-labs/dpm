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

export const InlineInput: React.FC<InlineInputProps> = (props) => {
  const styles = useStyles();

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <View style={[styles.container, props.style]}>
        <Typography.Subtitle style={styles.label}>{props.label}</Typography.Subtitle>
        <TextInput {...props} style={[styles.input, props.inputStyle]} textAlignVertical="top" />
      </View>
      {props.error !== undefined && (
        <Typography.Caption style={styles.errorLabel}>{props.error}</Typography.Caption>
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
