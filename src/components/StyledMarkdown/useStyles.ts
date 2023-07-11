import { makeStyle } from 'config/theme';
import {
  TypographyConfigRegular16,
  TypographyConfigSemiBold16,
} from 'components/Typography/config';

const useStyles = makeStyle((theme) => ({
  link: {
    color: theme.colors.accent,
  },
  paragraph: {
    ...TypographyConfigRegular16,
    color: theme.colors.text,
  },
  strong: {
    ...TypographyConfigSemiBold16,
    color: theme.colors.text,
  },
}));

export default useStyles;
