import {makeStyle} from 'theming';

const useStyle = makeStyle((theme) => ({
  topMarginMedium: {
    marginTop: theme.spacing.m,
  },
  topMarginSmall: {
    marginTop: theme.spacing.s,
  },
  memoInput: {
    maxHeight: 200,
  },
}));

export default useStyle;
