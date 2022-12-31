import {makeStyle} from 'theming';

const useStyles = makeStyle((theme) => ({
  background: {
    backgroundColor: theme.colors.background,
  },
  submitButton: {
    color: theme.colors.primary,
    marginRight: theme.spacing.m,
  },
}));

export default useStyles;
