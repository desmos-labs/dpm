import React, { ReactElement } from 'react';
import { ImageBackground, ScrollView, View, ViewProps } from 'react-native';
import { useTheme } from 'react-native-paper';
import Divider from 'components/Divider';
import StatusBar from 'components/StatusBar';
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
};

const StyledSafeAreaView: React.FC<StyledSafeAreaViewProps> = (props) => {
  const { scrollable, topBar, divider, background, children, style } = props;
  const styles = useStyles(props);
  const theme = useTheme();

  return (
    <View style={styles.root}>
      <StatusBar />
      {background !== undefined && (
        <ImageBackground style={styles.background} source={background} />
      )}
      {topBar}
      {divider && <Divider />}
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
    </View>
  );
};

export default StyledSafeAreaView;
