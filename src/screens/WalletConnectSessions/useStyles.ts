import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  avatarImage: {
    right: 16,
  },
  dAppSessions: {
    flex: 1,
    backgroundColor: 'red',
  },
  noDAppContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
  },
  noDAppImage: {
    width: 150,
  },
  noDAppText: {
    textAlign: 'center',
  },
  authorizeButton: {
    marginTop: theme.spacing.l,
  },
  showRequestsButtons: {
    alignSelf: 'center',
    margin: theme.spacing.s,
  },
}));

export default useStyles;
