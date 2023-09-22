import React, { PropsWithChildren } from 'react';
import Markdown from 'react-native-markdown-display';
import useStyles from './useStyles';

export interface StyledMarkDownProps {}

/**
 * Component to display markdown formatted text.
 * This component will use the application Typography styles
 * to render the markdown content.
 */
const StyledMarkDown: React.FC<PropsWithChildren<StyledMarkDownProps>> = ({ children }) => {
  const styles = useStyles();
  return <Markdown style={styles}>{children}</Markdown>;
};

export default StyledMarkDown;
