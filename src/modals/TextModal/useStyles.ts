import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  title: {
    marginTop: theme.spacing.l,
  },
  message: {
    marginTop: theme.spacing.l,
  },
}));

export default useStyles;
