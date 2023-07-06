import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  deviceList: {
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  ledgerIcon: {
    marginLeft: 16,
    width: 8,
    height: 32,
  },
  ledgerName: {
    marginStart: theme.spacing.m,
  },
}));

export default useStyles;
