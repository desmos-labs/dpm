import {makeStyle} from 'theming';

const useStyles = makeStyle((theme) => ({
  details: {
    flex: 1,
  },
  confirmBtn: {
    margin: theme.spacing.m,
  },
}));

export default useStyles;
