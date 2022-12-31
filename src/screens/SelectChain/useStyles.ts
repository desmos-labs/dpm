import {makeStyle} from 'theming';

const useStyle = makeStyle((theme) => ({
  background: {
    backgroundColor: theme.colors.background2,
  },
  list: {
    flex: 1,
  },
  topMargin: {
    marginTop: theme.spacing.l,
  },
}));

export default useStyle;
