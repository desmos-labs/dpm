import React, { useCallback, useEffect, useRef } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { Animated, Image, ImageBackground, Text } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import { AccountCreationStackParams, RootStackParams } from '../../types/navigation';
import { Button, IconButton, StyledSafeAreaView } from '../../components';
import { makeStyle } from '../../theming';
import { DesmosLedgerApp } from '../../types/ledger';

declare type Props = CompositeScreenProps<
  StackScreenProps<AccountCreationStackParams, 'Login'>,
  StackScreenProps<RootStackParams>
>;

export default function Login({ navigation }: Props): JSX.Element {
  const { t } = useTranslation();
  const styles = useStyle();
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
      name: 'GenerateNewMnemonic',
      params: undefined,
    });
  }, [navigation]);

  const onImportMnemonic = useCallback(() => {
    navigation.navigate({
      name: 'ImportRecoveryPassphrase',
      params: undefined,
    });
  }, [navigation]);

  const onImportLedger = useCallback(() => {
    navigation.navigate({
      name: 'ConnectToLedgerScreens',
      params: {
        ledgerApp: DesmosLedgerApp,
        onConnectionEstablished: (transport: BluetoothTransport) => {
          navigation.navigate({
            name: 'PickDerivationPath',
            params: {
              ledgerTransport: transport,
            },
          });
        },
      },
    });
  }, [navigation]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <StyledSafeAreaView style={styles.root} noIosPadding>
      <ImageBackground
        source={require('../../assets/home-background-light.png')}
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
            source={require('../../assets/desmos-vertical-white.png')}
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
            onPress={onImportLedger}
          >
            {t('import with Ledger')}
          </Button>
        </Animated.View>
      </ImageBackground>
    </StyledSafeAreaView>
  );
}

const useStyle = makeStyle((theme) => ({
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
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 78,
    marginHorizontal: theme.spacing.m,
  },
  buttons: {
    justifyContent: 'center',
  },
  createWalletLabel: {
    color: theme.colors.primary,
  },
  buttonMargin: {
    marginTop: theme.spacing.l,
  },
}));
