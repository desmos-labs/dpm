import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { TabActions } from '@react-navigation/native';
import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import useStyles from './useStyles';

const BottomBar: FC<BottomTabBarProps> = (props) => {
  const { navigation, descriptors, state } = props;
  const styles = useStyles();
  const theme = useTheme();

  return (
    <View style={styles.root}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const color = focused ? theme.colors.primary : theme.colors.font['3'];
        const size = options.title === undefined ? 36 : 32;
        const textStyle = focused ? [styles.btnText, styles.btnTextSelected] : styles.btnText;

        const onPress = () => {
          const action = TabActions.jumpTo(route.name);
          navigation.dispatch(action);
        };
        return (
          <TouchableOpacity key={route.key} style={styles.btn} onPress={onPress}>
            {options.tabBarIcon &&
              options.tabBarIcon({
                focused,
                color,
                size,
              })}
            {options.title && <Text style={textStyle}>{options.title}</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomBar;
