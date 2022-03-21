import { useCallback } from 'react';
import { Keyboard } from 'react-native';

export default function useCloseKeyboard() {
	return useCallback(() => {
		Keyboard.dismiss();
	}, []);
}
