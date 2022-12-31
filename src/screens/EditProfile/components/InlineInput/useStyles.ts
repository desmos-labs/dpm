import {makeStyle} from 'theming';

const useStyles = makeStyle((theme) => ({
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
