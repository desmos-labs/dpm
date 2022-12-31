import {makeStyle} from 'theming';

const useStyles = makeStyle((theme) => ({
  root: {},
  image: {
    alignSelf: 'center',
    width: 200,
    height: 100,
  },
  title: {
    marginTop: theme.spacing.s,
  },
  button: {
    marginTop: theme.spacing.m,
  },
  centred: {
    alignSelf: 'center',
  },
}));

export default useStyles;
