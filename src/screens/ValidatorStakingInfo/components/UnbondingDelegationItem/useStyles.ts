import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  unbondingCompletionText: {
    color: theme.colors.primary,
  },
}));

export default useStyles;
