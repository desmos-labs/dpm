import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  content: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
}));

export default useStyles;
