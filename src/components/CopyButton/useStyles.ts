import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    backgroundColor: 'green',
    color: 'transparent',
  },
  snackbar: {
    backgroundColor: theme.colors.popupSurface,
    bottom: 0,
  },
}));

export default useStyles;
