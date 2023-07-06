import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { TabActions } from '@react-navigation/native';
import Typography from 'components/Typography';
import React, { FC } from 'react';
import { TouchableOpacity, View } from 'react-native';
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
        const size = options.title === undefined ? 45 : 24;
        const textStyle = focused ? [styles.btnText, styles.btnTextSelected] : styles.btnText;

        const onPress = () => {
          const action = TabActions.jumpTo(route.name);
          navigation.dispatch(action);
        };
        return (
          <TouchableOpacity key={route.key} style={styles.btn} onPress={onPress}>
            {options.tabBarBadge && (
              <Typography.Caption style={styles.tabBarBadge}>
                {options.tabBarBadge}
              </Typography.Caption>
            )}
            {options.tabBarIcon &&
              options.tabBarIcon({
                focused,
                color,
                size,
              })}
            {options.title &&
              (focused ? (
                <Typography.SemiBold10 style={textStyle} numberOfLines={1} ellipsizeMode={'middle'}>
                  {options.title}
                </Typography.SemiBold10>
              ) : (
                <Typography.Regular10 style={textStyle} numberOfLines={1} ellipsizeMode={'middle'}>
                  {options.title}
                </Typography.Regular10>
              ))}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomBar;
