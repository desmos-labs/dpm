import React, { useEffect, useRef } from 'react';
import { Animated, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { StyledSafeAreaView } from '../components';

const SplashScreen: React.FC = () => {
  const profileManagerTextOpacity = useRef(new Animated.Value(0)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;

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
        source={require('../assets/home-background-light.png')}
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
            source={require('../assets/desmos-vertical-white.png')}
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

const styles = StyleSheet.create({
  root: {
    padding: 0,
  },
  background: {
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  backArrow: {
    position: 'absolute',
    top: 40,
    left: 0,
    zIndex: 1,
  },
  icon: {
    alignSelf: 'center',
    width: 140,
    height: 115,
  },
  profileManagerText: {
    alignSelf: 'center',
    color: '#ffffff',
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 24,
  },
});

export default SplashScreen;
