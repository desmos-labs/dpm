import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Animated, ImageBackground, Platform, Text, View } from 'react-native';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import IconButton from 'components/IconButton';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import useImportNewAccount from 'hooks/useImportNewAccount';
import { DesmosChain } from 'config/LinkableChains';
import { applicationsIconsMap, desmosLogoWhite, homeBackgroundLight } from 'assets/images';
import { useStoredAccountsAddresses } from '@recoil/accounts';
import FastImage from 'react-native-fast-image';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { Web3AuthLoginProvider } from 'types/web3auth';
import useLoginWithWeb3Auth from 'hooks/useLoginWithWeb3Auth';
import useShowModal from 'hooks/useShowModal';
import Web3AuthLoginProvidersModal from 'modals/Web3AuthLoginProvidersModal';
import useShowToS from 'hooks/legal/useShowToS';
import useShowPrivacyPolicy from 'hooks/legal/useShowPrivacyPolicy';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.LANDING>;

const Landing = ({ navigation }: NavProps) => {
  const { t } = useTranslation('landing');
  const styles = useStyles();

  const accountsAddresses = useStoredAccountsAddresses();
  const importNewAccount = useImportNewAccount([DesmosChain], accountsAddresses);
  const loginWithWeb3Auth = useLoginWithWeb3Auth(DesmosChain, accountsAddresses);
  const showModal = useShowModal();

  const animate = !navigation.canGoBack();
  const initialOpacity = animate ? 0 : 1;
  const iconOpacity = useRef(new Animated.Value(initialOpacity)).current;
  const profileManagerTextOpacity = useRef(new Animated.Value(initialOpacity)).current;
  const buttonsOpacity = useRef(new Animated.Value(initialOpacity)).current;
  const primaryLoginProviders = useMemo(() => {
    const loginProviders = [];
    if (Platform.OS === 'ios') {
      loginProviders.push(Web3AuthLoginProvider.Apple, Web3AuthLoginProvider.Google);
    } else {
      loginProviders.push(Web3AuthLoginProvider.Google, Web3AuthLoginProvider.Apple);
    }
    loginProviders.push(
      Web3AuthLoginProvider.Twitter,
      Web3AuthLoginProvider.Discord,
      Web3AuthLoginProvider.Reddit,
    );
    return loginProviders;
  }, []);

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
    importNewAccount();
  }, [importNewAccount]);

  const importFromSocial = useCallback(
    (social: Web3AuthLoginProvider) => {
      loginWithWeb3Auth(social);
    },
    [loginWithWeb3Auth],
  );

  const showOtherSocialLogin = useCallback(() => {
    showModal(Web3AuthLoginProvidersModal, {
      onSelect: loginWithWeb3Auth,
    });
  }, [showModal, loginWithWeb3Auth]);

  const showToS = useShowToS();

  const showPrivacyPolicy = useShowPrivacyPolicy();

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <StyledSafeAreaView style={styles.root} noIosPadding>
      <ImageBackground source={homeBackgroundLight} resizeMode="stretch" style={styles.background}>
        {navigation.canGoBack() ? (
          <IconButton style={styles.backArrow} icon="back" onPress={goBack} color="#ffffff" />
        ) : null}
        <View style={styles.content}>
          {/* Desmos logo */}
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

          {/* Screen content */}
          <Animated.View
            style={{
              ...styles.buttonsContainer,
              opacity: buttonsOpacity,
            }}
          >
            {/* Create new wallet */}
            <Button
              style={styles.buttons}
              mode="outlined"
              color="#ffffff"
              onPress={onCreateAccount}
            >
              {t('create wallet')}
            </Button>

            <Spacer paddingVertical={12} />

            {/* Import wallet */}
            <Button
              style={styles.buttons}
              mode="outlined"
              color="#ffffff"
              onPress={onImportAccount}
            >
              {t('account:import account')}
            </Button>

            <Spacer paddingVertical={12} />

            <View style={styles.loginWithContainer}>
              <View style={styles.loginDivider} />
              <Spacer paddingHorizontal={8} />
              <Typography.Subtitle style={styles.loginWithLabel}>
                {t('or login with')}
              </Typography.Subtitle>
              <Spacer paddingHorizontal={8} />
              <View style={styles.loginDivider} />
            </View>

            <Spacer paddingVertical={8} />

            {/* Social login buttons */}
            <View style={styles.socialButtonsContainer}>
              {primaryLoginProviders.map((loginProvider, index) => (
                <IconButton
                  key={`login-button-${index}`}
                  style={styles.socialButton}
                  icon={applicationsIconsMap[loginProvider]}
                  color={null}
                  onPress={() => importFromSocial(loginProvider)}
                />
              ))}
            </View>

            <Spacer paddingVertical={4} />

            <Button
              style={styles.buttons}
              color="#ffffff"
              onPress={showOtherSocialLogin}
              labelStyle={{
                fontSize: 14,
              }}
            >
              {t('show more')}
            </Button>
          </Animated.View>
        </View>

        {/* Footer */}
        <Animated.View
          style={{
            opacity: buttonsOpacity,
            ...styles.footer,
          }}
        >
          <Typography.Caption style={styles.legalText}>
            <Trans
              t={t}
              i18nKey={'by using this app you accept the tos and privacy policy'}
              components={{
                tos: <Typography.Caption style={styles.clickableText} onPress={showToS} />,
                privacy: (
                  <Typography.Caption style={styles.clickableText} onPress={showPrivacyPolicy} />
                ),
              }}
            />
          </Typography.Caption>
          <Spacer paddingVertical={16} />
        </Animated.View>
      </ImageBackground>
    </StyledSafeAreaView>
  );
};

export default Landing;
