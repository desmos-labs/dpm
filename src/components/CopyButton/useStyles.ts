import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  icon: {
    color: theme.colors.text,
  },
}));

export default useStyles;
