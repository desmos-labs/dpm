import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
  spendableContainer: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  spendableAmountValue: {
    marginStart: 4,
  },
}));

export default useStyles;
