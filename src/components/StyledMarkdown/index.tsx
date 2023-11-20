import React, { PropsWithChildren } from 'react';
import Markdown from 'react-native-markdown-display';
import useStyles from './useStyles';

interface StyledMarkDownProps {}

/**
 * Component to display markdown formatted text.
 * This component will use the application Typography styles
 * to render the markdown content.
 */
const StyledMarkDown: React.FC<PropsWithChildren<StyledMarkDownProps>> = ({ children }) => {
  const styles = useStyles();
  const content = React.useMemo(() => {
    if (typeof children !== 'string') {
      return children;
    }
    return (
      children
        // Replace <br/> with a new line
        .replace(/<\/?br\/?>/g, '\n')
        // Replace <b> with **
        .replace(/<\/?b>/g, '**')
        // Replace <i> with *
        .replace(/<\/?i>/g, '*')
        // Remove all <p> tags
        .replace(/<\/?p.*>/g, '')
        // Replace <a> with a markdown link
        .replace(
          /<a.*?href=('|")(.*?)('|").*?>(.*?)<\/a>/g,
          (_1, _2, url, _3, text) => `[${text}](${url})`,
        )
    );
  }, [children]);

  return <Markdown style={styles}>{content}</Markdown>;
};

export default StyledMarkDown;
