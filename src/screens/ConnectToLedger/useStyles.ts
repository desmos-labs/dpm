import {makeStyle} from 'config/theme';

const useStyles = makeStyle((theme) => ({
  image: {
    width: '60%',
    height: '30%',
    alignSelf: 'center',
  },
  animation: {
    alignSelf: 'center',
  },
  status: {
    marginTop: theme.spacing.m,
    textAlign: 'center',
    alignSelf: 'center',
  },
  errorMessage: {
    marginTop: theme.spacing.m,
    color: theme.colors.error,
    textAlign: 'center',
    alignSelf: 'center',
  },
}));

export default useStyles;
