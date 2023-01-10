import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    flexGrow: 1,
    justifyContent: 'space-around',
  },
  content: {
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
