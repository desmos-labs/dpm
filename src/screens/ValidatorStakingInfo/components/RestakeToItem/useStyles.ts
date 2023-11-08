import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.s,
  },
  validatorInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  valuesContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default useStyles;
