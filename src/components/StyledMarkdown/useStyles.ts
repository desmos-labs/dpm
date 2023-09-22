import { makeStyle } from 'config/theme';
import {
  TypographyConfigH1,
  TypographyConfigH2,
  TypographyConfigH4,
  TypographyConfigH5,
  TypographyConfigH6,
  TypographyConfigRegular16,
  TypographyConfigSemiBold16,
} from 'components/Typography/config';

const useStyles = makeStyle((theme) => ({
  heading1: {
    ...TypographyConfigH1,
    color: theme.colors.text,
  },
  heading2: {
    ...TypographyConfigH2,
    color: theme.colors.text,
  },
  heading3: {
    ...TypographyConfigH2,
    color: theme.colors.text,
  },
  heading4: {
    ...TypographyConfigH4,
    color: theme.colors.text,
  },
  heading5: {
    ...TypographyConfigH5,
    color: theme.colors.text,
  },
  heading6: {
    ...TypographyConfigH6,
    color: theme.colors.text,
  },
  body: {
    ...TypographyConfigRegular16,
    color: theme.colors.text,
  },
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
