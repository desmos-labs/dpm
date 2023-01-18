import { Appearance, ColorSchemeName } from 'react-native';
import { useEffect, useRef, useState } from 'react';

const useDebouncingColorScheme = (delay = 500): NonNullable<ColorSchemeName> => {
  // Suppress the next line line as the NodeJS namespace will be provided at runtime
  // eslint-disable-next-line no-undef
  let timeout = useRef<NodeJS.Timeout | null>(null).current;
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    const subscription = Appearance.addChangeListener(onColorSchemeChange);
    return () => {
      resetCurrentTimeout();
      subscription.remove();
    };
  });

  const onColorSchemeChange = (preferences: Appearance.AppearancePreferences) => {
    resetCurrentTimeout();
    timeout = setTimeout(() => {
      setColorScheme(preferences.colorScheme);
    }, delay);
  };

  const resetCurrentTimeout = () => {
    if (timeout) {
      clearTimeout(timeout);
    }
  };

  return colorScheme as NonNullable<ColorSchemeName>;
};

export default useDebouncingColorScheme;
