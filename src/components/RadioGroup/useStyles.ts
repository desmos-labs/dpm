import {makeStyle} from 'theming';

const useStyles = makeStyle((theme) => ({
  root: {
    flex: 1,
  },
  title: {
    color: theme.colors.font['2'],
  },
  fieldsContainer: {
    backgroundColor: theme.colors.surface2,
    borderRadius: theme.roundness,
  },
  fieldWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
  },
  interBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.line,
  },
}));

export default useStyles;
