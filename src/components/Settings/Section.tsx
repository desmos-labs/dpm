import React, { useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { makeStyle } from '../../theming';
import { Divider } from '../Divider';
import { Typography } from '../typography';

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
        <>
          <View style={styles.fieldWrapper} key={`w_${index.toString()}`}>
            {c}
          </View>
          {!last && <Divider style={styles.divider} />}
        </>
      );
    });
  }, [children, styles.fieldWrapper, styles.divider]);

  return (
    <View style={[styles.root, style]}>
      {title !== undefined && (
        <Typography.Subtitle style={styles.title}>{title}</Typography.Subtitle>
      )}
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  fieldWrapper: {
    padding: 16,
  },
  divider: {
    marginLeft: theme.spacing.m,
  },
}));
