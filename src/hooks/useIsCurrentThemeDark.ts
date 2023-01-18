import { useTheme } from 'react-native-paper';

/**
 * Hooks that tells if the current theme is dark or not.
 */
const useIsCurrentThemeDark = () => {
  const theme = useTheme();
  return theme.dark;
};

export default useIsCurrentThemeDark;
