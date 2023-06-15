import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    borderWidth: 1,
    borderColor: theme.colors.neutral300,
    backgroundColor: theme.colors.background,
    borderRadius: theme.roundness,
    padding: theme.spacing.m,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  transactionHash: {
    color: theme.colors.primary,
    maxWidth: '25%',
  },
  msgCounter: {
    paddingStart: 4,
    color: theme.colors.accent,
  },
  inlineField: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'baseline',
  },
  fieldLabel: {
    flex: 1,
  },
}));

export default useStyles;
