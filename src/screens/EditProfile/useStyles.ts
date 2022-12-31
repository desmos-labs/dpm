import {makeStyle} from 'theming';

const useStyles = makeStyle((theme) => ({
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.m,
    paddingBottom: theme.spacing.m,
  },
  input: {},
  saveBtn: {
    margin: theme.spacing.m,
  },
}));

export default useStyles;
