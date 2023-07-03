import { makeStyle } from 'config/theme';

const useStyle = makeStyle((theme) => ({
  root: {
    padding: 0,
  },
  background: {
    width: '100%',
    height: '100%',
  },
  content: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
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
    marginTop: 26,
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
  buttonsLabel: {
    color: theme.colors.primary,
  },
  loginWithContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  loginWithLabel: {
    color: '#ffffff',
  },
  loginDivider: {
    flex: 1,
    backgroundColor: '#ffffff',
    height: 1,
  },
  socialButtonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  socialButton: {
    backgroundColor: '#ffffff',
    borderRadius: theme.roundness * 3,
    margin: theme.spacing.s,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    maxWidth: '80%',
    width: '80%',
    alignSelf: 'center',
  },
  legalText: {
    color: '#ffffff',
    // set flexShrink to avoid the text overflow the container.
    flexShrink: 1,
  },
  clickableText: {
    color: theme.colors.accent,
  },
}));

export default useStyle;
