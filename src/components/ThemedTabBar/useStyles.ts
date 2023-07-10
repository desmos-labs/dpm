import { makeStyle } from 'config/theme';
import { TypographyConfigSemiBold14 } from 'components/Typography/config';

const useStyles = makeStyle((theme) => ({
  root: {
    backgroundColor: '#fff',
    elevation: 0,
  },
  indicator: {
    backgroundColor: theme.colors.primary,
  },
  label: {
    ...TypographyConfigSemiBold14,
    color: theme.colors.primary,
    textTransform: 'none',
    shadowColor: undefined,
    shadowOpacity: 0,
    shadowOffset: undefined,
    shadowRadius: 0,
  },
}));

export default useStyles;
