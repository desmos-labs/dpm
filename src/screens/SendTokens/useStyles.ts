import { makeStyle } from 'config/theme';

const useStyle = makeStyle((theme) => ({
  topMarginMedium: {
    marginTop: theme.spacing.m,
  },
  topMarginSmall: {
    marginTop: theme.spacing.s,
  },

  spendableLoadingIndicator: {
    width: 8,
    height: 8,
  },
  spendableContainer: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  spendableAmount: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  spendableAmountValue: {
    marginStart: 4,
  },

  memoInput: {
    maxHeight: 200,
  },
}));

export default useStyle;
