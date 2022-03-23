import React, { useState } from 'react';
import { useTheme } from 'react-native-paper';
import { TextInput, Props as TextInputProps } from './TextInput';
import { IconButton } from './IconButton';

export const SecureTextInput: React.FC<TextInputProps> = (props) => {
  const theme = useTheme();
  const [hideText, setHideText] = useState(true);

  return (
    <TextInput
      {...props}
      secureTextEntry={hideText}
      textAlignVertical="center"
      rightElement={
        <IconButton
          icon={hideText ? 'hide' : 'show'}
          color={theme.colors.icon['3']}
          onPress={() => {
            setHideText((old) => !old);
          }}
        />
      }
    />
  );
};
