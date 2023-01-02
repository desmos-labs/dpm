import {makeStyle} from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  word: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    margin: theme.spacing.s,
  },
}));

export default useStyles;
