import {makeStyle} from 'theming';

const useStyles = makeStyle((theme) => ({
  background: {
    backgroundColor: theme.colors.background2,
  },
  avatarImage: {
    right: 16,
  },
  dAppSessions: {
    flex: 1,
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
}));

export default useStyles;
