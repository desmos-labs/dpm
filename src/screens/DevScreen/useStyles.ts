import { makeStyle } from 'config/theme';

const useStyles = makeStyle((_) => ({
  button: { padding: 18, borderWidth: 1, borderColor: 'grey', borderRadius: 12 },
  flatList: { padding: 16 },
  text: { color: 'black' },
}));

export default useStyles;
