import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    paddingTop: theme.spacing.l,
  },
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
    marginTop: theme.spacing.l,
  },
  button: {
    marginTop: theme.spacing.l,
  },
}));

export default useStyles;
