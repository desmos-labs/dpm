import {makeStyle} from 'config/theme';

const useStyles = makeStyle(_ => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 4,
  },
  label: {
    flex: 2,
    paddingTop: 8,
  },
  text: {
    flex: 7,
    marginStart: 2,
    paddingTop: 8,
    paddingBottom: 0,
  },
}));

export default useStyles;
