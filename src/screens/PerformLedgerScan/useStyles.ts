import { makeStyle } from 'config/theme';

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
  noDeviceError: {
    alignSelf: 'center',
    color: theme.colors.primary,
    marginTop: theme.spacing.l,
  },
  retryScan: {
    marginTop: theme.spacing.m,
  },
}));

export default useStyles;
