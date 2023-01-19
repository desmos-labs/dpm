import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  text: {
    marginLeft: 8,
  },
}));

export default useStyles;
