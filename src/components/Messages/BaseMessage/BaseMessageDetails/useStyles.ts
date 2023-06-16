import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    borderWidth: 1,
    borderRadius: theme.roundness,
    borderColor: theme.colors.neutral300,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing.m,
    borderBottomWidth: 1,
    borderColor: theme.colors.neutral300,
    alignItems: 'center',
  },
  headerIcon: {
    width: 18,
    height: 18,
    marginRight: theme.spacing.xs,
  },
  headerLabel: {
    color: theme.colors.primary,
    textTransform: 'capitalize',
  },
  messageValue: {
    padding: theme.spacing.m,
  },
  messageField: {
    padding: theme.spacing.m,
  },
}));

export default useStyles;
