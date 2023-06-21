import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  label: {
    color: theme.colors.neutral900,
    marginBottom: theme.spacing.xs,
  },
  value: {
    color: theme.colors.neutral700,
  },
  loadingIndicator: {
    alignSelf: 'flex-start',
  },
}));

export default useStyles;
