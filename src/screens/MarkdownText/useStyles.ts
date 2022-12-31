import {makeStyle} from 'theming';

const useStyles = makeStyle(_ => ({
  content: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
}));

export default useStyles;
