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
  errorView: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  errorImage: {
    width: 110,
    height: 110,
  },
}));

export default useStyles;
