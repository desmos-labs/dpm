import { makeStyle } from 'config/theme';

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
  loginWithLabel: {
    color: '#ffffff',
    alignSelf: 'center',
  },
  socialButtonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  socialButton: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.roundness * 3,
    margin: theme.spacing.s,
  },
}));

export default useStyle;
