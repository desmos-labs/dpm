import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  image: {
    width: 110,
    height: 110,
    alignSelf: 'center',
  },
  animation: {
    alignSelf: 'center',
    width: 110,
    height: 110,
  },
  status: {
    marginTop: theme.spacing.m,
    textAlign: 'center',
    alignSelf: 'center',
  },
  errorMessage: {
    marginTop: theme.spacing.m,
    textAlign: 'center',
    alignSelf: 'center',
  },
  installAppMessage: {
    marginTop: theme.spacing.m,
    color: theme.colors.primary,
    textAlign: 'center',
  },
}));

export default useStyles;
