import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  header: {
    color: theme.colors.font['2'],
    textTransform: 'capitalize',
  },
  headerContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.s,
  },
}));

export default useStyles;
