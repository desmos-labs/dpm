import {makeStyle} from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 4,
  },
  label: {
    flex: 3,
    paddingTop: 8,
  },
  input: {
    flex: 7,
    paddingTop: 8,
    paddingBottom: 0,
    color: theme.colors.font['1'],
  },
  errorLabel: {
    color: theme.colors.error,
  },
}));

export default useStyles;
