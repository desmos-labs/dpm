import {makeStyle} from 'theming';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: theme.spacing.s,
    flexGrow: 1,
    flexShrink: 1,
  },
  nickname: {
    color: theme.colors.primary,
  },
  dtag: {},
  menuDivider: {
    marginHorizontal: 16,
  },
  itemSelected: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
  },
}));

export default useStyles;
