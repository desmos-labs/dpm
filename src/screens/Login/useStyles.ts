import {makeStyle} from 'config/theme';

const useStyle = makeStyle((theme) => ({
  root: {
    padding: 0,
  },
  background: {
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  backArrow: {
    position: 'absolute',
    top: 40,
    left: 0,
    zIndex: 1,
  },
  icon: {
    alignSelf: 'center',
    width: 140,
    height: 115,
  },
  profileManagerText: {
    alignSelf: 'center',
    color: '#ffffff',
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 24,
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 78,
    marginHorizontal: theme.spacing.m,
  },
  buttons: {
    justifyContent: 'center',
  },
  createWalletLabel: {
    color: theme.colors.primary,
  },
  buttonMargin: {
    marginTop: theme.spacing.l,
  },
}));

export default useStyle;
