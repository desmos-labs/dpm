import React, { ReactElement } from 'react';
import {
  ImageBackground,
  Platform,
  ScrollView,
  StatusBar,
  TouchableWithoutFeedback,
  View,
  ViewProps,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import useCloseKeyboard from '../hooks/useCloseKeyboard';
import { makeStyleWithProps } from '../theming';
import { Divider } from './Divider';

export type Props = ViewProps & {
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
};

export const StyledSafeAreaView: React.FC<Props> = (props) => {
  const { scrollable, topBar, divider, background, children, style } = props;
  const styles = useStyles(props);
  const theme = useTheme();
  const closeKeyboard = useCloseKeyboard();
  const statusBarVariant = theme.dark ? 'light-content' : 'dark-content';

  return (
    <View style={styles.root}>
      <StatusBar barStyle={statusBarVariant} />
      {background !== undefined && (
        <ImageBackground style={styles.background} source={background} />
      )}
      {topBar}
      {divider && <Divider />}
      <TouchableWithoutFeedback onPress={closeKeyboard} accessible={false} disabled={scrollable}>
        <View style={[styles.content, style]}>
          {scrollable ? (
            <View style={styles.scrollViewContainer}>
              <ScrollView
                style={{ margin: -theme.spacing.m }}
                contentContainerStyle={{ padding: theme.spacing.m }}
              >
                {children}
              </ScrollView>
            </View>
          ) : (
            children
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const useStyles = makeStyleWithProps((props: Props, theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    paddingBottom: Platform.OS === 'android' || props.noIosPadding === true ? 0 : 24,
    backgroundColor: theme.colors.background,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    padding: props?.padding ?? theme.spacing.m,
    backgroundColor: props.background === undefined ? theme.colors.background : 'transparent',
  },
  scrollViewContainer: {
    flex: 1,
  },
}));
