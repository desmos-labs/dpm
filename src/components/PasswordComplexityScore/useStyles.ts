import {makeStyle} from 'theming';

const useStyles = makeStyle((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  scoreField: {
    height: 2,
    width: 10,
    backgroundColor: theme.colors.surface,
    marginRight: 4,
  },
}));

export default useStyles;
