import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { TabActions } from '@react-navigation/native';
import React from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { makeStyle } from '../theming';

export const HomeScreenBottomBar: React.FC<BottomTabBarProps> = (props) => {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <View style={styles.root}>
      {props.state.routes.map((route, index) => {
        const { options } = props.descriptors[route.key];
        const focused = props.state.index === index;
        const color = focused ? theme.colors.primary : theme.colors.font['3'];
        const size = options.title === undefined ? 36 : 32;
        const textStyle = focused ? [styles.btnText, styles.btnTextSelected] : styles.btnText;

        const onPress = () => {
          const action = TabActions.jumpTo(route.name);
          props.navigation.dispatch(action);
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

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    elevation: 9,
    justifyContent: 'space-around',
    padding: theme.spacing.s,
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.l : theme.spacing.s,
  },
  btn: {
    alignItems: 'center',
    flex: 1,
  },
  btnText: {
    fontSize: 9,
    lineHeight: 11,
    color: theme.colors.font['3'],
    textTransform: 'capitalize',
  },
  btnTextSelected: {
    color: theme.colors.primary,
  },
}));
