import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { makeStyle } from '../theming';

export type PasswordComplexityScore = 0 | 1 | 2 | 3 | 4;

export type PasswordComplexityProps = {
  score: PasswordComplexityScore;
};

export const PasswordComplexity: React.FC<PasswordComplexityProps> = (props) => {
  const { score } = props;
  const theme = useTheme();
  const styles = useStyle();

  const boxStyles = useMemo(() => {
    let scoreColor = theme.colors.surface;
    switch (score) {
      case 1:
        scoreColor = theme.colors.passwordComplexity.weak;
        break;
      case 2:
        scoreColor = theme.colors.passwordComplexity.normal;
        break;

      case 3:
        scoreColor = theme.colors.passwordComplexity.strong;
        break;

      case 4:
        scoreColor = theme.colors.passwordComplexity.veryStrong;
        break;
      default:
    }

    const boxViewStyles: StyleProp<ViewStyle>[] = [];
    for (let i = 0; i < 4; i += 1) {
      let style: StyleProp<ViewStyle>;
      if (i < score) {
        style = StyleSheet.compose(styles.scoreField as StyleProp<ViewStyle>, {
          backgroundColor: scoreColor,
        });
      } else {
        style = styles.scoreField as StyleProp<ViewStyle>;
      }
      boxViewStyles.push(style);
    }
    return boxViewStyles;
  }, [theme.colors, styles.scoreField, score]);

  return (
    <View style={styles.container}>
      <View style={boxStyles[0]} />
      <View style={boxStyles[1]} />
      <View style={boxStyles[2]} />
      <View style={boxStyles[3]} />
    </View>
  );
};

const useStyle = makeStyle((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  scoreField: {
    height: 2,
    width: 10,
    backgroundColor: theme.colors.surface,
    marginRight: 4,
  },
}));
