import { makeStyle } from 'config/theme';
import { TypographyConfigRegular14 } from 'components/Typography/config';

const useStyles = makeStyle((theme) => ({
  root: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    width: '100%',
  },
  selectText: {
    ...TypographyConfigRegular14,
    textAlign: 'left',
  },
  dropDownIcon: {
    width: 24,
    height: 24,
  },
  dropdown: {
    borderRadius: theme.roundness,
  },
  rowStyle: {
    backgroundColor: theme.colors.background,
  },
}));

export default useStyles;
