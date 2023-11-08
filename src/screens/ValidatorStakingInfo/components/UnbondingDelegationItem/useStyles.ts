import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  inlineFieldsContainer: {
    flexDirection: 'row',
  },
  fieldValue: {
    marginStart: theme.spacing.s,
    color: theme.colors.primary,
  },
}));

export default useStyles;
