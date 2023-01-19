import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  button: {
    color: theme.colors.icon['5'],
  },
}));

export default useStyles;
