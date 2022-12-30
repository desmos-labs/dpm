import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import ThemedLottieView from 'components/ThemedLottieView';
import Typography from 'components/Typography';
import useStyles from './useStyles';

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

export default BiometricsLoadingIndicator;
