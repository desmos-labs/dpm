import {makeStyle} from 'config/theme';

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
  snackbar: {
    zIndex: 2,
    backgroundColor: theme.colors.popupSurface,
  },
  testnetText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  topBar: {
    backgroundColor: 'transparent',
  },
  avatarImage: {
    marginRight: 16,
  },
  userBalance: {
    marginHorizontal: 13,
  },
  transactionsContainer: {
    backgroundColor: theme.colors.background2,
    paddingTop: theme.spacing.m,
    paddingHorizontal: theme.spacing.m,
    borderTopLeftRadius: theme.roundness,
    borderTopRightRadius: theme.roundness,
    marginTop: theme.spacing.l,
    flex: 1,
  },
  transactionList: {
    marginTop: 16,
  },
  airdropBanner: {
    position: 'absolute',
    zIndex: 2,
    bottom: 0,
    width: '100%',
    height: 80,
  },
}));

export default useStyles;
