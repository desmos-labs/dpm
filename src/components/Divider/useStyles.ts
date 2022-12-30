import {makeStyle} from 'theming';

const useStyles = makeStyle((theme) => ({
  divider: {
    height: 1,
    backgroundColor: theme.colors.line,
  },
}));

export default useStyles;
