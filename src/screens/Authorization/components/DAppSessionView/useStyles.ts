import {makeStyle} from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.background,
    padding: 32,
  },
  icon: {
    width: 60,
    height: 60,
  },
  appName: {
    marginTop: theme.spacing.s,
  },
  permissions: {
    textAlign: 'center',
    color: theme.colors.primary,
    marginTop: theme.spacing.s,
  },
  revokeButton: {
    marginTop: theme.spacing.l,
  },
}));

export default useStyles;
