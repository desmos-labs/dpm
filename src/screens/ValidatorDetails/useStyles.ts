import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  topBar: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    zIndex: 1,
    marginHorizontal: theme.spacing.m,
  },
  topBarButton: {
    color: theme.colors.icon['5'],
    backgroundColor: 'rgba(80, 80, 80, 0.4)',
  },
  validatorStatus: {
    marginLeft: theme.spacing.m,
  },
  infoContainer: {
    marginTop: theme.spacing.s,
    marginHorizontal: theme.spacing.m,
    flex: 1,
  },
  stakeButton: {
    marginTop: theme.spacing.s,
    marginBottom: theme.spacing.xl,
    marginHorizontal: theme.spacing.m,
  },
}));

export default useStyles;
