import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    padding: theme.spacing.s,
    alignItems: 'flex-start',
  },
}));

export default useStyles;
