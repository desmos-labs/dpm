import React, { useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Typography from '../../Typography';
import useStyles from './useStyles';

export type Props = {
  title?: string;
  style?: StyleProp<ViewStyle>;
};

const Section: React.FC<Props> = (props) => {
  const { title, style, children } = props;
  const styles = useStyles();

  const wrapped = useMemo(() => {
    const count = React.Children.count(children);
    return React.Children.map(children, (c, index) => {
      const last = count === index + 1;
      return (
        c && (
          <View style={[!last && styles.interBorder]} key={`w_${index.toString()}`}>
            {c}
          </View>
        )
      );
    });
  }, [children, styles.interBorder]);

  return (
    <View style={[styles.root, style]}>
      {title ? <Typography.Subtitle style={styles.title}>{title}</Typography.Subtitle> : null}
      <View style={styles.fieldsContainer}>{wrapped}</View>
    </View>
  );
};

export default Section;
