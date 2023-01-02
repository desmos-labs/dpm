import {makeStyle} from 'config/theme';

const useStyles = makeStyle((theme) => ({
  image: {
    alignSelf: 'center',
    width: 200,
    height: 100,
  },
  title: {
    marginTop: theme.spacing.s,
    alignSelf: 'center',
  },
}));

export default useStyles;
