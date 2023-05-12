import { makeStyle } from 'config/theme';

const useStyle = makeStyle((theme) => ({
  topMarginSmall: {
    marginTop: theme.spacing.s,
  },
  memoInput: {
    maxHeight: 200,
  },
}));

export default useStyle;
