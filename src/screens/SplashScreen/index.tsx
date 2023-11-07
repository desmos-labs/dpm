import React, { useEffect, useRef } from 'react';
import { Animated, Platform, Text, View } from 'react-native';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import FastImage from 'react-native-fast-image';
import { desmosLogoWhite, landingBackground } from 'assets/images';
import useStyles from './useStyles';

const SplashScreen: React.FC = () => {
  const profileManagerTextOpacity = useRef(new Animated.Value(0)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const styles = useStyles();

  useEffect(() => {
    Animated.sequence([
      Animated.timing(iconOpacity, {
        duration: Platform.select({
          ios: 500,
          // No animation on android to prevent
          // partial visualized image.
          android: 0,
        }),
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(profileManagerTextOpacity, {
        duration: Platform.select({
          ios: 500,
          // No animation on android to prevent
          // partial visualized text.
          android: 0,
        }),
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, [iconOpacity, profileManagerTextOpacity]);

  return (
    <StyledSafeAreaView style={styles.root} noIosPadding background={landingBackground}>
      <View style={styles.container}>
        <Animated.View
          style={{
            ...styles.icon,
            opacity: iconOpacity,
          }}
        >
          <FastImage style={styles.icon} source={desmosLogoWhite} resizeMode="contain" />
        </Animated.View>
        <Animated.View
          style={{
            opacity: profileManagerTextOpacity,
          }}
        >
          <Text style={styles.profileManagerText}>Profile Manager</Text>
        </Animated.View>
      </View>
    </StyledSafeAreaView>
  );
};

export default SplashScreen;
