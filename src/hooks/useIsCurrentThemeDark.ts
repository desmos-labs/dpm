import { useTheme } from 'react-native-paper';

/**
 * Hooks that tells if the current theme is dark or not.
 */
export default function useIsCurrentThemeDark() {
  const theme = useTheme();

  return theme.dark;
}
