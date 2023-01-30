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
import useStyles from './useStyles';

export type StyledSafeAreaViewProps = ViewProps & {
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
};

const StyledSafeAreaView: React.FC<StyledSafeAreaViewProps> = (props) => {
  const {
    scrollable,
    topBar,
    divider,
    background,
    children,
    style,
    touchableWithoutFeedbackDisabled,
  } = props;
  const styles = useStyles(props);
  const theme = useTheme();
  const statusBarVariant = theme.dark ? 'light-content' : 'dark-content';

  return (
    <View style={styles.root}>
      <StatusBar barStyle={statusBarVariant} backgroundColor="transparent" />
      {background !== undefined && (
        <ImageBackground style={styles.background} source={background} />
      )}
      {topBar}
      {divider && <Divider />}
      <TouchableWithoutFeedback
        disabled={touchableWithoutFeedbackDisabled ?? true}
        onPress={Keyboard.dismiss}
      >
        <View style={[styles.content, style]}>
          {scrollable ? (
            <View style={styles.scrollViewContainer} onStartShouldSetResponder={() => false}>
              <ScrollView
                style={{ margin: -theme.spacing.m }}
                contentContainerStyle={{ padding: theme.spacing.m }}
              >
                {children}
              </ScrollView>
            </View>
          ) : (
            <View style={{ flex: 1 }} onStartShouldSetResponder={() => false}>
              {children}
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default StyledSafeAreaView;
