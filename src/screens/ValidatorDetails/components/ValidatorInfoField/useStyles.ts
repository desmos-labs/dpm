import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: theme.spacing.s,
    alignItems: 'center',
  },
  label: {
    flex: 1,
  },
  valueContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '80%',
  },
  extraInfo: {
    marginRight: theme.spacing.xs,
    color: theme.colors.font['2'],
  },
  url: {
    color: theme.colors.primary,
  },
}));

export default useStyles;
