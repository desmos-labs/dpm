import { makeStyle } from 'config/theme';
import { TypographyConfigSemiBold14 } from 'components/Typography/config';

const useStyles = makeStyle((theme) => ({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 0,
  },
  tabDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FEB027',
    marginTop: 3,
  },
  tabText: {
    ...TypographyConfigSemiBold14,
    color: theme.colors.text,
  },
}));

export default useStyles;
