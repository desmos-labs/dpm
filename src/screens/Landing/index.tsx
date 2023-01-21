import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Image, ImageBackground, Text } from 'react-native';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import IconButton from 'components/IconButton';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import useSaveAccount from 'hooks/useSaveAccount';
import useImportAccount from 'hooks/useImportAccount';
import { DesmosChain } from 'config/LinkableChains';
import { desmosLogoWhite, homeBackgroundLight } from 'assets/images';
import { useStoredAccountsAddresses } from '@recoil/accounts';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.LANDING>;

const Landing = ({ navigation }: NavProps) => {
  const { t } = useTranslation('landing');
  const styles = useStyles();

  const accountsAddresses = useStoredAccountsAddresses();
  const importAccount = useImportAccount([DesmosChain], accountsAddresses);
  const saveAccount = useSaveAccount();

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

  const onCreateAccount = useCallback(() => {
    navigation.navigate({
      name: ROUTES.CREATE_NEW_MNEMONIC,
      params: undefined,
    });
  }, [navigation]);

  const onImportAccount = useCallback(async () => {
    const importedAccount = await importAccount();
    if (importedAccount !== undefined) {
      saveAccount(importedAccount.account);
    }
  }, [importAccount, saveAccount]);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <StyledSafeAreaView style={styles.root} noIosPadding>
      <ImageBackground source={homeBackgroundLight} resizeMode="stretch" style={styles.background}>
        {navigation.canGoBack() ? (
          <IconButton style={styles.backArrow} icon="back" onPress={goBack} color="#ffffff" />
        ) : null}

        <Animated.View
          style={{
            ...styles.icon,
            opacity: iconOpacity,
          }}
        >
          <Image style={styles.icon} source={desmosLogoWhite} resizeMode="contain" />
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
            onPress={onCreateAccount}
            labelStyle={styles.createWalletLabel}
          >
            {t('create wallet')}
          </Button>
          <Button
            style={[styles.buttons, styles.buttonMargin]}
            mode="outlined"
            color="#ffffff"
            onPress={onImportAccount}
          >
            {t('account:import account')}
          </Button>
        </Animated.View>
      </ImageBackground>
    </StyledSafeAreaView>
  );
};

export default Landing;
