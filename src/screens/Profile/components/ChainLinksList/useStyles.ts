import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    marginTop: theme.spacing.s,
    marginBottom: theme.spacing.s,
    alignSelf: 'center',
  },
  noConnectionsContainer: {
    alignItems: 'center',
  },
  noConnectionImage: {
    width: 90,
    height: 90,
  },
  connectionsContainer: {
    display: 'flex',
    flex: 1,
    flexGrow: 1,
    flexDirection: 'column',
  },
  connectionsList: {
    marginTop: 8,
  },
  connectChainButton: {
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
}));

export default useStyles;
