import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { Appearance, NativeEventSubscription } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Settings } from 'react-native-paper/lib/typescript/core/settings';
import useDebouncingColorScheme from 'hooks/useDebouncingColorScheme';
import DesmosIcon from 'components/DesmosIcon';
import LightTheme from 'config/theme/LightTheme';
import DarkTheme from 'config/theme/DarkTheme';
import { useSettings } from '@recoil/settings';

const PaperProviderSettings: Settings = {
  icon: (props) => <DesmosIcon {...props} />,
};

const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const settings = useSettings();
  const [appTheme, setAppTheme] = useState(LightTheme);
  const colorScheme = useDebouncingColorScheme();

  const handleAppearanceChange = useCallback(() => {
    setAppTheme(colorScheme === 'light' ? LightTheme : DarkTheme);
  }, [colorScheme]);

  useEffect(() => {
    let appearanceSubscription: NativeEventSubscription | undefined;
    if (settings.theme === 'auto') {
      handleAppearanceChange();
      appearanceSubscription = Appearance.addChangeListener(handleAppearanceChange);
      return () => {
        appearanceSubscription?.remove();
      };
    }
    if (settings.theme === 'dark') {
      setAppTheme(DarkTheme);
    } else {
      setAppTheme(LightTheme);
    }
    return () => {
      appearanceSubscription?.remove();
    };
  }, [handleAppearanceChange, settings.theme]);

  return (
    <PaperProvider theme={appTheme} settings={PaperProviderSettings}>
      {children}
    </PaperProvider>
  );
};

export default ThemeProvider;
