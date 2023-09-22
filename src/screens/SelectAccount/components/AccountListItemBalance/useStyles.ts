import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  errorText: {
    color: theme.colors.error,
  },
}));

export default useStyles;
