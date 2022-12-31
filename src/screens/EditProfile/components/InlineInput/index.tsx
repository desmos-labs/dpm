import React, { ComponentProps } from 'react';
import { StyleProp, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import Typography from 'components/Typography';
import useStyles from './useStyles';

export type InlineInputProps = Omit<ComponentProps<typeof TextInput>, 'style'> & {
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

export default InlineInput;
