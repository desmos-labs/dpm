import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Settings } from 'react-native-paper/lib/typescript/core/settings';
import { Appearance } from 'react-native';
import { DesmosIcon } from '../components';
import { AppThemeDark, AppThemeLight } from '../theming';
import AppearanceListener = Appearance.AppearanceListener;
import useSetting from '../hooks/settings/useSetting';

const PaperProviderSettings: Settings = {
  icon: (props) => <DesmosIcon {...props} />,
};

export const ThemeProvider: React.FC = ({ children }) => {
  const theme = useSetting('theme');
  const [appTheme, setAppTheme] = useState(AppThemeLight);

  useEffect(() => {
    if (theme === 'auto') {
      const listener: AppearanceListener = (preferences) => {
        const colorScheme = preferences.colorScheme ?? 'light';
        setAppTheme(colorScheme === 'light' ? AppThemeLight : AppThemeDark);
      };
      listener({
        colorScheme: Appearance.getColorScheme(),
      });
      Appearance.addChangeListener(listener);
      return () => {
        Appearance.removeChangeListener(listener);
      };
    }
    if (theme === 'dark') {
      setAppTheme(AppThemeDark);
    } else {
      setAppTheme(AppThemeLight);
    }
  }, [theme]);

  return (
    <PaperProvider theme={appTheme} settings={PaperProviderSettings}>
      {children}
    </PaperProvider>
  );
};
