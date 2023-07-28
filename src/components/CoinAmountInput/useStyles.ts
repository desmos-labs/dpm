import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  currencyToggleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyIcon: {
    width: 24,
    height: 24,
    marginLeft: theme.spacing.xs,
    marginTop: 2,
  },
  currencyIconDisabled: {
    opacity: 0.3,
  },
  dsmEquivalentLabel: {
    color: theme.colors.primary,
  },
  spendableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spendableAmountLabel: {
    marginEnd: 4,
  },
}));

export default useStyles;
