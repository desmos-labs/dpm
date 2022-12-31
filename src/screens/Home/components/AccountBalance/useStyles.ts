import {makeStyle} from 'theming';

const useStyles = makeStyle((theme) => ({
  root: {},
  text: {
    color: theme.colors.font['5'],
  },
  addressContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    width: '60%',
    overflow: 'hidden',
  },
  balanceContainer: {
    borderRadius: theme.roundness,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: theme.spacing.m,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  balanceText: {
    color: theme.dark ? theme.colors.background : theme.colors.text,
  },
  sendButton: {
    height: 54,
    width: 54,
    borderRadius: 100,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: theme.colors.font['5'],
  },
}));

export default useStyles;
