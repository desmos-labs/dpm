import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  deviceList: {
    marginTop: theme.spacing.xl,
  },
  ledgerListItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.roundness,
  },
  ledgerIcon: {
    width: 8,
    height: 32,
  },
  ledgerName: {
    marginStart: theme.spacing.m,
  },
}));

export default useStyles;
