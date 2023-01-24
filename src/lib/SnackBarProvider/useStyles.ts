import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  snackbar: {
    backgroundColor: theme.colors.popupSurface,
  },
}));

export default useStyles;
