import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  validatorImage: {
    alignSelf: 'center',
    height: 32,
    width: 32,
    borderRadius: 20,
  },
  validatorDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default useStyles;
