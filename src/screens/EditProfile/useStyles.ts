import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  content: {
    flex: 1,
    paddingBottom: theme.spacing.m,
  },
  input: {
    flex: 1,
    paddingHorizontal: theme.spacing.m,
  },
  bioEditor: {
    flex: 1,
    flexGrow: 1,
  },
  saveBtn: {
    margin: theme.spacing.m,
  },
}));

export default useStyles;
