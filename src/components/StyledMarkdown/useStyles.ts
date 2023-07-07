import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  link: {
    color: theme.colors.accent,
  },
}));

export default useStyles;
