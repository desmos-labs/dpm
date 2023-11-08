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
  inlineFieldsContainer: {
    flexDirection: 'row',
  },
  fieldValue: {
    color: theme.colors.primary,
    marginStart: theme.spacing.s,
  },
}));

export default useStyles;
