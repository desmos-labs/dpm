import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  testnetBadge: {
    position: 'absolute',
    bottom: 5,
    right: 0,
    padding: theme.spacing.s,
    borderTopLeftRadius: theme.roundness,
    borderBottomLeftRadius: theme.roundness,
    backgroundColor: theme.colors.background,
    zIndex: 1,
    elevation: 4,
  },
  testnetText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  avatarImage: {
    marginRight: 16,
  },
  transactionsContainer: {
    paddingHorizontal: theme.spacing.m,
    borderTopLeftRadius: theme.roundness,
    borderTopRightRadius: theme.roundness,
    flex: 1,
  },
  noTransactionsView: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
  },
  noTransactionsImage: {
    marginTop: 42,
    height: 180,
  },
}));

export default useStyles;
