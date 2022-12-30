import React, { ReactElement } from 'react';
import { Platform, StatusBar, StyleProp, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { makeStyleWithProps } from '../theming';
import IconButton from './IconButton';
import { Typography } from './Typography';

type ScreenProps = {
  navigation: {
    readonly goBack: () => void;
    readonly canGoBack: () => boolean;
    readonly openDrawer?: () => void;
  };
};

export type TopBarProps = {
  /**
   * Props regarding of the stack screen to manage.
   */
  stackProps: ScreenProps;
  /**
   * Optional title to display.
   */
  title?: string;
  /**
   * Tells if the title should be capitalized or not.
   * If undefined the title will be capitalized.
   */
  capitalizeTitle?: boolean;
  /**
   * Element to display on the top right corner.
   */
  rightElement?: ReactElement;
  /**
   * Color of the top left icon.
   */
  leftIconColor?: string;
  style?: StyleProp<ViewStyle>;
};

export const TopBar: React.FC<TopBarProps> = (props) => {
  const { stackProps, title, rightElement, leftIconColor, style } = props;
  const theme = useTheme();
  const styles = useStyles(props);
  const { navigation } = stackProps;
  const navigationGoBack = navigation.canGoBack() ? (
    <IconButton
      color={leftIconColor ?? theme.colors.icon['1']}
      icon="back"
      onPress={navigation.goBack}
    />
  ) : null;

  return (
    <View style={[styles.root, style]}>
      <View style={[styles.container, styles.containerLeft]}>
        {navigation.openDrawer ? (
          <IconButton
            color={leftIconColor ?? theme.colors.icon['1']}
            icon="menu"
            onPress={navigation.openDrawer}
            size={20}
          />
        ) : (
          navigationGoBack
        )}
      </View>
      <View style={[styles.container, styles.containerCenter]}>
        <Typography.Subtitle style={styles.title}>{title}</Typography.Subtitle>
      </View>
      <View style={[styles.container, styles.containerRight]}>{rightElement}</View>
    </View>
  );
};

const useStyles = makeStyleWithProps((props: TopBarProps, theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 42,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  containerLeft: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    zIndex: 1,
  },
  containerCenter: {
    flex: 2,
  },
  title: {
    textTransform: props.capitalizeTitle === false ? 'none' : 'capitalize',
    textAlign: 'center',
  },
  containerRight: {
    alignItems: 'flex-end',
    zIndex: 1,
  },
}));
