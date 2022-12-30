import {makeStyle} from 'theming';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing.m,
  },
  label: {
    flex: 1,
  },
  value: {
    color: theme.colors.font['3'],
  },
}));

export default useStyles;
