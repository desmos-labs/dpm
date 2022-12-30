import React, { useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { makeStyle } from '../../theming';
import { Typography } from '../Typography';

export type Props = {
  title?: string;
  style?: StyleProp<ViewStyle>;
};

export const Section: React.FC<Props> = (props) => {
  const { title, style, children } = props;
  const styles = useStyle();

  const wrapped = useMemo(() => {
    const count = React.Children.count(children);
    return React.Children.map(children, (c, index) => {
      const last = count === index + 1;
      return (
        <View style={[!last && styles.interBorder]} key={`w_${index.toString()}`}>
          {c}
        </View>
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

const useStyle = makeStyle((theme) => ({
  root: {},
  title: {
    color: theme.colors.font['2'],
    marginBottom: theme.spacing.s,
  },
  fieldsContainer: {
    backgroundColor: theme.colors.surface2,
    borderRadius: theme.roundness,
  },
  interBorder: {
    borderBottomWidth: 1,
    borderRadius: 0,
    borderColor: theme.colors.line,
  },
}));
