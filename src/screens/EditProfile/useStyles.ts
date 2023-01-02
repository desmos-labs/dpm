import {makeStyle} from 'config/theme';

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
