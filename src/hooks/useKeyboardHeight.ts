import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

export default function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  return keyboardHeight;
}
