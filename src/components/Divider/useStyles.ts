import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  divider: {
    height: 1,
    backgroundColor: theme.colors.line,
  },
}));

export default useStyles;
