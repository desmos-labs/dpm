import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    alignItems: 'center',
  },
  totalBalanceLabelContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  hideButton: {
    backgroundColor: theme.colors.surface,
  },
  iconButton: {
    marginRight: -4,
  },
  addressContainer: {
    display: 'flex',
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
