import { makeStyle } from 'config/theme';

const useStyle = makeStyle((theme) => ({
  desmosIcon: {
    width: '100%',
    flex: 1,
  },
  settingsBtn: {
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },
  accountsContainer: {
    marginTop: 64,
    flex: 8,
  },
  accountsList: {
    marginTop: theme.spacing.m,
  },
  addAccountBtn: {
    marginTop: theme.spacing.s,
  },
}));

export default useStyle;
