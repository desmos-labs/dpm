import {makeStyle} from 'theming';

const useStyle = makeStyle((theme) => ({
  root: {},
  title: {
    color: theme.colors.font['2'],
    marginBottom: theme.spacing.s,
  },
  fieldsContainer: {
    backgroundColor: theme.colors.surface2,
    borderRadius: theme.roundness,
  },
  interBorder: {
    borderBottomWidth: 1,
    borderRadius: 0,
    borderColor: theme.colors.line,
  },
}));

export default useStyle;
