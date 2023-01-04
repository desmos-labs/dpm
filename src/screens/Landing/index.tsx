import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Image, ImageBackground, Text } from 'react-native';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import IconButton from 'components/IconButton';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.LANDING>;

const Landing = ({ navigation }: NavProps) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const animate = !navigation.canGoBack();
  const initialOpacity = animate ? 0 : 1;
  const iconOpacity = useRef(new Animated.Value(initialOpacity)).current;
  const profileManagerTextOpacity = useRef(new Animated.Value(initialOpacity)).current;
  const buttonsOpacity = useRef(new Animated.Value(initialOpacity)).current;

  useEffect(() => {
    if (animate) {
      Animated.sequence([
        Animated.timing(iconOpacity, {
          duration: 750,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(profileManagerTextOpacity, {
          duration: 500,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(buttonsOpacity, {
          duration: 500,
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [animate, iconOpacity, profileManagerTextOpacity, buttonsOpacity]);

  const onCreatePressed = useCallback(() => {
    navigation.navigate({
      name: ROUTES.CREATE_WALLET,
      params: undefined,
    });
  }, [navigation]);

  const onImportMnemonic = useCallback(() => {
    navigation.navigate({
      name: ROUTES.IMPORT_RECOVERY_PASSPHRASE,
      params: undefined,
    });
  }, [navigation]);

  const onImportWithLedger = useCallback(() => {}, [navigation]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <StyledSafeAreaView style={styles.root} noIosPadding>
      <ImageBackground
        source={require('assets/images/homeBackground-light.png')}
        resizeMode="stretch"
        style={styles.background}
      >
        {navigation.canGoBack() ? (
          <IconButton style={styles.backArrow} icon="back" onPress={goBack} color="#ffffff" />
        ) : null}

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
        <Animated.View
          style={{
            ...styles.buttonsContainer,
            opacity: buttonsOpacity,
          }}
        >
          <Button
            style={styles.buttons}
            mode="contained"
            color="#ffffff"
            onPress={onCreatePressed}
            labelStyle={styles.createWalletLabel}
          >
            {t('create wallet')}
          </Button>
          <Button
            style={[styles.buttons, styles.buttonMargin]}
            mode="outlined"
            color="#ffffff"
            onPress={onImportMnemonic}
          >
            {t('import recovery passphrase')}
          </Button>
          <Button
            style={[styles.buttons, styles.buttonMargin]}
            mode="outlined"
            color="#ffffff"
            onPress={onImportWithLedger}
          >
            {t('import with Ledger')}
          </Button>
        </Animated.View>
      </ImageBackground>
    </StyledSafeAreaView>
  );
};

export default Landing;
