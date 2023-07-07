import React, { PropsWithChildren } from 'react';
import Markdown from 'react-native-markdown-display';
import {
  TypographyConfigRegular16,
  TypographyConfigSemiBold16,
} from 'components/Typography/config';
import useStyles from './useStyles';

export interface StyledMarkDownProps {}

const StyledMarkDown: React.FC<PropsWithChildren<StyledMarkDownProps>> = ({ children }) => {
  const styles = useStyles();
  return (
    <Markdown
      style={{
        paragraph: TypographyConfigRegular16,
        strong: TypographyConfigSemiBold16,
        link: styles.link,
      }}
    >
      {children}
    </Markdown>
  );
};

export default StyledMarkDown;
