import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    alignItems: 'center',
  },
  addressContainer: {
    displaye: 'flex',
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
  },
  address: {
    maxWidth: '50%',
  },
}));

export default useStyles;
