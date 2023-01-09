import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  header: {
    paddingBottom: 8,
    color: theme.colors.font['2'],
    textTransform: 'capitalize',
  },
}));

export default useStyles;
