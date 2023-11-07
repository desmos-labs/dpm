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
   * View padding horizontal.
   */
  paddingHorizontal?: number;
  /**
   * View padding vertical.
   */
  paddingVertical?: number;
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
    customBackgroundColor,
    ...viewProps
  } = props;
  const styles = useStyles(props);
  const theme = useTheme();
  const statusBarVariant = theme.dark ? 'light-content' : 'dark-content';

  return (
    <TouchableWithoutFeedback
      disabled={touchableWithoutFeedbackDisabled ?? true}
      onPress={touchableWithoutFeedbackOnPress ?? Keyboard.dismiss}
    >
      <SafeAreaView
        style={[
          styles.root,
          { backgroundColor: customBackgroundColor ?? theme.colors.background },
          style,
        ]}
        edges={edges}
        {...viewProps}
      >
        <StatusBar barStyle={statusBarVariant} backgroundColor="transparent" />
        {background !== undefined && (
          <ImageBackground style={styles.background} source={background} />
        )}
        <View style={styles.topBar}>{topBar}</View>
        {divider && <Divider />}
        {scrollable ? (
          <View style={styles.scrollViewContainer} onStartShouldSetResponder={() => false}>
            <ScrollView
              style={{ margin: -theme.spacing.m }}
              contentContainerStyle={{ padding: theme.spacing.m, flexGrow: 1 }}
            >
              {children}
            </ScrollView>
          </View>
        ) : (
          children
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default StyledSafeAreaView;
