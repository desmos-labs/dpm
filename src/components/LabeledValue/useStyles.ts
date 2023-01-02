import {makeStyle} from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    padding: theme.spacing.s,
  },
}));

export default useStyles;
