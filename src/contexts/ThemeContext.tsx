import React, { useCallback, useEffect, useState } from 'react';
import { Appearance, NativeEventSubscription } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { Settings } from 'react-native-paper/lib/typescript/core/settings';
import { AppThemeDark, AppThemeLight } from 'theming';
import useSetting from 'hooks/settings/useSetting';
import useDebouncingColorScheme from 'hooks/useDebouncingColorScheme';
import DesmosIcon from 'components/DesmosIcon';

const PaperProviderSettings: Settings = {
  icon: (props) => <DesmosIcon {...props} />,
};

const ThemeProvider: React.FC = ({ children }) => {
  const theme = useSetting('theme');
  const [appTheme, setAppTheme] = useState(AppThemeLight);
  const colorScheme = useDebouncingColorScheme();

  const handleAppearanceChange = useCallback(() => {
    setAppTheme(colorScheme === 'light' ? AppThemeLight : AppThemeDark);
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
      setAppTheme(AppThemeDark);
    } else {
      setAppTheme(AppThemeLight);
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
