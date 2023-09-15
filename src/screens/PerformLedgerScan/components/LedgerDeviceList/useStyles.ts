import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  deviceList: {
    margin: -16,
    marginTop: theme.spacing.xl,
  },
  ledgerListItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    margin: theme.spacing.s,
    padding: theme.spacing.m,
    borderRadius: theme.roundness,

    // Shadows
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 20,
    elevation: 8,
    shadowOpacity: 1,
  },
  ledgerIcon: {
    color: theme.colors.text,
    marginLeft: 16,
    width: 8,
    height: 32,
  },
  ledgerName: {
    marginStart: theme.spacing.m,
  },
}));

export default useStyles;
