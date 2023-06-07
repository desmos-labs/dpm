import { KeyboardAvoidingView, Platform } from 'react-native';
import React, { PropsWithChildren } from 'react';

/**
 * It is a component to solve the common problem of views that need to move out of the way of the virtual keyboard.
 * It can automatically adjust either its position or bottom padding based on the position of the keyboard.
 */
const DKeyboardAvoidingView: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <KeyboardAvoidingView
    keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
    {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
    children={children}
  />
);

export default DKeyboardAvoidingView;
