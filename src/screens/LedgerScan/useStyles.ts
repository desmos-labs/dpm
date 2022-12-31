import {makeStyle} from 'theming';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  lookingForDevices: {
    alignSelf: 'center',
  },
  title: {
    marginTop: theme.spacing.xl,
    alignSelf: 'center',
  },
  advice: {
    textAlign: 'center',
    marginTop: theme.spacing.l,
    paddingHorizontal: theme.spacing.m,
  },
  deviceList: {
    marginTop: theme.spacing.xl,
  },
  noDeviceError: {
    alignSelf: 'center',
    color: theme.colors.primary,
    marginTop: theme.spacing.l,
  },
  ledgerListItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
  },
  ledgerName: {
    marginStart: theme.spacing.m,
  },
  retryScan: {
    marginTop: theme.spacing.m,
  },
}));

export default useStyles;
