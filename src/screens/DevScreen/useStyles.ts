import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  button: { padding: 18, borderWidth: 1, borderColor: 'grey', borderRadius: 12 },
  flatList: { padding: 16 },
  text: { color: theme.colors.text },
}));

export default useStyles;
