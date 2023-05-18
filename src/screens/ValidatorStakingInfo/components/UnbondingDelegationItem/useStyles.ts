import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  unbondingCompletionText: {
    color: theme.colors.primary,
  },
}));

export default useStyles;
