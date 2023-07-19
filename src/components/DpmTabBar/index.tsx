import React, { ReactElement } from 'react';
import { Route, TabBarProps } from 'react-native-tab-view';
import { Animated, TouchableOpacity, View } from 'react-native';
import useStyles from './useStyles';

/**
 * Component that implement a custom TabBar having the application style.
 */
function DpmTabBar<T extends Route>(tabProps: TabBarProps<T>): ReactElement<any, any> | null {
  const styles = useStyles();
  const inputRange = React.useMemo(
    () => tabProps.navigationState.routes.map((x, i) => i),
    [tabProps.navigationState.routes],
  );

  return (
    <View style={styles.tabBar}>
      {tabProps.navigationState.routes.map((route, i) => {
        const titleOpacity = tabProps.position.interpolate({
          inputRange,
          outputRange: inputRange.map((inputIndex) => (inputIndex === i ? 1 : 0.5)),
        });
        const dotOpacity = tabProps.position.interpolate({
          inputRange,
          outputRange: inputRange.map((inputIndex) => (inputIndex === i ? 1 : 0)),
        });

        return (
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => tabProps.jumpTo(route.key)}
            key={i}
          >
            <Animated.Text style={[styles.tabText, { opacity: titleOpacity }]}>
              {route.title}
            </Animated.Text>
            <Animated.View style={[styles.tabDot, { opacity: dotOpacity }]} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default DpmTabBar;
