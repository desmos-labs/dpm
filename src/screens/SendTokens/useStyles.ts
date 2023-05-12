import { makeStyle } from 'config/theme';

const useStyle = makeStyle((theme) => ({
  topMarginSmall: {
    marginTop: theme.spacing.s,
  },
}));

export default useStyle;
