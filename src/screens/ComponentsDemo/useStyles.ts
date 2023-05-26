import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
  inline: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
}));

export default useStyles;
