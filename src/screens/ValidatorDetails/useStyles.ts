import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  infoContainer: {
    marginTop: theme.spacing.m,
  },
  stakeButton: {
    marginBottom: theme.spacing.xl,
  },
}));

export default useStyles;
