import React, { ReactElement } from 'react';
import {
  ImageBackground,
  Keyboard,
  ScrollView,
  StatusBar,
  TouchableWithoutFeedback,
  View,
  ViewProps,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import Divider from 'components/Divider';
import { SafeAreaView, SafeAreaViewProps } from 'react-native-safe-area-context';
import useStyles from './useStyles';

export type StyledSafeAreaViewProps = ViewProps & {
  /**
   * Edges to apply to the SafeAreaView.
   */
  edges?: SafeAreaViewProps['edges'];
  /**
   * True if the content should be wrapped inside a ScrollView.
   */
  scrollable?: boolean;
  /**
   * View padding.
   */
  padding?: number;
  /**
   * Shows an element as a top bar.
   */
  topBar?: ReactElement;
  /**
   * If true adds a divider between the
   * top bar and the content.
   */
  divider?: boolean;
  /**
   * Image that will be displayed as background.
   */
  background?: React.ComponentProps<typeof ImageBackground>['source'];

  /**
   * If true removes the bottom padding on iOS bottom swipe area
   */
  noIosPadding?: boolean;
  /**
   * Enable touchable without feeback to close keyboard
   */
  touchableWithoutFeedbackDisabled?: boolean;
  /**
   * Callback that will be called if `touchableWithoutFeedbackDisabled` is
   * false. If this value is undefined this will default to `Keyboard.dismiss`
   * to hide the user keyboard on iOS devices.
   */
  touchableWithoutFeedbackOnPress?: () => any;
  /**
   * Override themed background color.
   */
  customBackgroundColor?: string;
};

const StyledSafeAreaView: React.FC<StyledSafeAreaViewProps> = (props) => {
  const {
    edges,
    scrollable,
    topBar,
    divider,
    background,
    children,
    style,
    touchableWithoutFeedbackDisabled,
    touchableWithoutFeedbackOnPress,
    ...viewProps
    customBackgroundColor,
  } = props;
  const styles = useStyles(props);
  const theme = useTheme();
  const statusBarVariant = theme.dark ? 'light-content' : 'dark-content';

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: customBackgroundColor ?? theme.colors.background }]}
      edges={edges}
    >
      <StatusBar barStyle={statusBarVariant} backgroundColor="transparent" />
      {background !== undefined && (
        <ImageBackground style={styles.background} source={background} />
      )}
      {topBar}
      {divider && <Divider />}
      <TouchableWithoutFeedback
        disabled={touchableWithoutFeedbackDisabled ?? true}
        onPress={touchableWithoutFeedbackOnPress ?? Keyboard.dismiss}
      >
        <View style={[styles.content, style]}>
          {scrollable ? (
            <View
              {...viewProps}
              style={styles.scrollViewContainer}
              onStartShouldSetResponder={() => false}
            >
              <ScrollView
                style={{ margin: -theme.spacing.m }}
                contentContainerStyle={{ padding: theme.spacing.m, flexGrow: 1 }}
              >
                {children}
              </ScrollView>
            </View>
          ) : (
            <View {...viewProps} style={{ flex: 1 }} onStartShouldSetResponder={() => false}>
              {children}
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default StyledSafeAreaView;
