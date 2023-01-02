import React, { useCallback, useEffect, useState } from 'react';
import { Appearance, NativeEventSubscription } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Settings } from 'react-native-paper/lib/typescript/core/settings';
import { DarkTheme, LightTheme } from 'config/theme';
import useSetting from 'hooks/settings/useSetting';
import useDebouncingColorScheme from 'hooks/useDebouncingColorScheme';
import DesmosIcon from 'components/DesmosIcon';

const PaperProviderSettings: Settings = {
  icon: (props) => <DesmosIcon {...props} />,
};

const ThemeProvider: React.FC = ({ children }) => {
  const theme = useSetting('theme');
  const [appTheme, setAppTheme] = useState(LightTheme);
  const colorScheme = useDebouncingColorScheme();

  const handleAppearanceChange = useCallback(() => {
    setAppTheme(colorScheme === 'light' ? LightTheme : DarkTheme);
  }, [colorScheme]);

  useEffect(() => {
    let appearanceSubscription: NativeEventSubscription | undefined;
    if (theme === 'auto') {
      handleAppearanceChange();
      appearanceSubscription = Appearance.addChangeListener(handleAppearanceChange);
      return () => {
        appearanceSubscription?.remove();
      };
    }
    if (theme === 'dark') {
      setAppTheme(DarkTheme);
    } else {
      setAppTheme(LightTheme);
    }
    return () => {
      appearanceSubscription?.remove();
    };
  }, [handleAppearanceChange, theme]);

  return (
    <PaperProvider theme={appTheme} settings={PaperProviderSettings}>
      {children}
    </PaperProvider>
  );
};

export default ThemeProvider;
