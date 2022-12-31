import {makeStyle} from 'theming';

const useStyles = makeStyle((theme) => ({
  root: {
    paddingTop: 0,
  },
  button: {
    marginTop: theme.spacing.m,
  },
  password: {
    marginTop: theme.spacing.s,
  },
  errorMsg: {
    color: theme.colors.error,
    marginTop: theme.spacing.s,
  },
}));

export default useStyles;
