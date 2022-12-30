import {makeStyle} from 'theming';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
  },
  label: {
    flex: 1,
  },
  value: {
    color: theme.colors.font['3'],
  },
  communityIcon: {
    height: 24,
    width: 24,
    marginRight: theme.spacing.s,
  },
}));

export default useStyles;
