import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    // backgroundColor: theme.colors.popupBackground,
    // justifyContent: 'flex-end',
    // padding: 0,
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing.s,
    right: theme.spacing.s,
    zIndex: 1,
  },
  chainDetails: {
    alignItems: 'center',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  chainLinkIcon: {
    width: 60,
    height: 60,
  },
  linkDetailTitle: {
    fontWeight: 'bold',
  },
  disconnectButton: {
    marginTop: theme.spacing.m,
  },
}));

export default useStyles;
