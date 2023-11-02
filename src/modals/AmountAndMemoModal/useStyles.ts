import { makeStyle } from 'config/theme';
import { Platform } from 'react-native';

const useStyles = makeStyle((theme) => ({
  root: {
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.l : 0,
  },
  title: {
    alignSelf: 'center',
  },
}));

export default useStyles;
