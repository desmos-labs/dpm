import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  container: {
    width: 150,
  },
  text: {
    color: theme.colors.accent,
  },
}));

export default useStyles;
