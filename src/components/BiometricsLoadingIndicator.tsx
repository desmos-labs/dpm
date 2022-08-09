import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { makeStyle } from '../theming';
import { ThemedLottieView } from './ThemedLottieView';
import { Typography } from './Typography';

const BiometricsLoadingIndicator: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <Animated.View
      style={styles.view}
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
    >
      <ThemedLottieView
        style={styles.image}
        source="loading"
        autoPlay
        loop
        autoSize
        resizeMode="center"
      />
      <View style={styles.textContainer}>
        <Typography.Subtitle>{t('authenticating')}...</Typography.Subtitle>
      </View>
    </Animated.View>
  );
};

const useStyles = makeStyle((theme) => ({
  view: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: theme.colors.background,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  textContainer: {
    padding: theme.spacing.s,
  },
}));

export default BiometricsLoadingIndicator;
