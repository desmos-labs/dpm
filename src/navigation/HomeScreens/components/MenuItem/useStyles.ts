import {makeStyle} from 'theming';

const useStyles = makeStyle((_) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  text: {
    marginLeft: 8,
  },
}));

export default useStyles;
