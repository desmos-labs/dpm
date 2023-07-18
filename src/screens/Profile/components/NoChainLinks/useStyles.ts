import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  noConnectionsContainer: {
    alignItems: 'center',
  },
  noConnectionImage: {
    width: 90,
    height: 90,
  },
  connectChainButton: {
    marginTop: theme.spacing.m,
    marginBottom: theme.spacing.m,
  },
}));

export default useStyles;
