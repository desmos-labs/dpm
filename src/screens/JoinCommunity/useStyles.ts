import {makeStyle} from 'theming';

const useStyles = makeStyle((theme) => ({
  background: {
    backgroundColor: theme.colors.background2,
  },
}));

export default useStyles;
