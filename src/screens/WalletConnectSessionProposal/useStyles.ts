import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    backgroundColor: theme.colors.background2,
  },
  topBar: {
    backgroundColor: theme.colors.background2,
  },
  dappDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 10,
    flexBasis: 0,
  },
  dappIcon: {
    width: 60,
    height: 60,
  },
  permissionMessage: {
    marginTop: theme.spacing.m,
    textAlign: 'center',
  },
  bottomMessage: {
    textAlign: 'center',
    marginTop: theme.spacing.m,
    flexGrow: 1,
  },
  denyButton: {
    marginTop: theme.spacing.s,
  },
}));

export default useStyles;
