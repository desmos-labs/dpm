import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
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
