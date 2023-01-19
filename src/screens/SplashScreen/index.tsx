import React, { useEffect, useRef } from 'react';
import { Animated, Image, ImageBackground, Text } from 'react-native';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import useStyles from './useStyles';

const SplashScreen: React.FC = () => {
  const profileManagerTextOpacity = useRef(new Animated.Value(0)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;
  const styles = useStyles();

  useEffect(() => {
    Animated.sequence([
      Animated.timing(iconOpacity, {
        duration: 500,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(profileManagerTextOpacity, {
        duration: 500,
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, [iconOpacity, profileManagerTextOpacity]);

  return (
    <StyledSafeAreaView style={styles.root} noIosPadding>
      <ImageBackground
        source={require('assets/images/homeBackground-light.png')}
        resizeMode="stretch"
        style={styles.background}
      >
        <Animated.View
          style={{
            ...styles.icon,
            opacity: iconOpacity,
          }}
        >
          <Image
            style={styles.icon}
            source={require('assets/images/desmosLogo-white.png')}
            resizeMode="contain"
          />
        </Animated.View>
        <Animated.View
          style={{
            opacity: profileManagerTextOpacity,
          }}
        >
          <Text style={styles.profileManagerText}>Profile Manager</Text>
        </Animated.View>
      </ImageBackground>
    </StyledSafeAreaView>
  );
};

export default SplashScreen;
