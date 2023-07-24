import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  image: {
    alignSelf: 'center',
    width: 200,
    height: 100,
  },
  title: {
    textAlign: 'center',
    marginTop: theme.spacing.l,
  },
  message: {
    textAlign: 'center',
    marginTop: theme.spacing.m,
  },
  checkboxContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginTop: theme.spacing.m,
  },
}));

export default useStyles;
