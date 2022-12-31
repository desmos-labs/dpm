import {makeStyle} from 'theming';

const useStyles = makeStyle((theme) => ({
  root: {
    backgroundColor: theme.colors.popupBackground,
    justifyContent: 'flex-end',
    padding: 0,
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing.s,
    right: theme.spacing.s,
    zIndex: 1,
  },
  details: {
    backgroundColor: theme.colors.background,
    paddingVertical: 60,
    alignItems: 'center',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  chainIcon: {
    width: 44,
    height: 44,
  },
  disconnectButton: {
    marginTop: theme.spacing.m,
  },
}));

export default useStyles;
