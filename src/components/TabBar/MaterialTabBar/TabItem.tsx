import React from 'react';
import { TypographyConfigSemiBold14 } from 'components/Typography/config';
import { makeStyle } from 'config/theme';
import { Platform, TouchableOpacity, View } from 'react-native';
import { MaterialTabItemProps } from 'react-native-collapsible-tab-view';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useTheme } from 'react-native-paper';

const StyledMaterialTabItem = ({
  index,
  indexDecimal,
  name,
  label,
  onPress,
  labelStyle,
  inactiveOpacity = Platform.OS === 'ios' ? 0.2 : 1,
}: MaterialTabItemProps<string>) => {
  const styles = useStyles();
  const theme = useTheme();

  const stylez = useAnimatedStyle(() => ({
    opacity: interpolate(
      indexDecimal.value,
      [index - 1, index, index + 1],
      [inactiveOpacity, 1, inactiveOpacity],
      Extrapolation.CLAMP,
    ),
    color:
      Math.abs(index - indexDecimal.value) < 0.5 ? theme.colors.primary : theme.colors.placeholder,
  }));

  return (
    <TouchableOpacity
      style={styles.tab}
      onPress={() => {
        onPress(name);
      }}
    >
      <View>
        <Animated.Text style={[labelStyle, stylez, styles.tabItemText]}>{label}</Animated.Text>
      </View>
    </TouchableOpacity>
  );
};

export default StyledMaterialTabItem;

const useStyles = makeStyle((theme) => ({
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.s,
  },
  tabItemText: {
    alignSelf: 'center',
    ...TypographyConfigSemiBold14,
  },
}));
