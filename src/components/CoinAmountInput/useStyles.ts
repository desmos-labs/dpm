import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  dsmEquivalentLabel: {
    marginTop: 6,
    color: theme.colors.primary,
  },
  spendableContainer: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  spendableAmountLabel: {
    marginEnd: 4,
  },
}));

export default useStyles;
