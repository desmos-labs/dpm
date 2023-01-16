import React, { ReactElement } from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import IconButton from 'components/IconButton';
import Typography from 'components/Typography';
import useStyles from './useStyles';

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
  titleStyle?: StyleProp<TextStyle>;
  hideGoBack?: boolean;
};

const TopBar: React.FC<TopBarProps> = (props) => {
  const { stackProps, title, rightElement, leftIconColor, style, titleStyle, hideGoBack } = props;
  const theme = useTheme();
  const styles = useStyles(props);
  const { navigation } = stackProps;
  const navigationGoBack =
    hideGoBack !== true && navigation.canGoBack() ? (
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
        <Typography.Subtitle style={[styles.title, titleStyle]}>{title}</Typography.Subtitle>
      </View>
      <View style={[styles.container, styles.containerRight]}>{rightElement}</View>
    </View>
  );
};

export default TopBar;
