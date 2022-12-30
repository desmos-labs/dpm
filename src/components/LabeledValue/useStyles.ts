import {makeStyle} from 'theming';

const useStyles = makeStyle((theme) => ({
  root: {
    padding: theme.spacing.s,
  },
}));

export default useStyles;
