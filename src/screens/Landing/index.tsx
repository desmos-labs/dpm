import { StackScreenProps } from '@react-navigation/stack';
import React, { useMemo, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Animated, ImageBackground, Platform, View } from 'react-native';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import IconButton from 'components/IconButton';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import useImportNewAccounts from 'hooks/useImportNewAccounts';
import { DesmosChain } from 'config/LinkableChains';
import { applicationsIconsMap, desmosLogoWhite, landingBackground } from 'assets/images';
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
import DpmCheckBox from 'components/CheckBox';
import SingleButtonModal from 'modals/SingleButtonModal';
import { ModalMode } from 'modals/ModalScreen';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.LANDING>;

const Landing = ({ navigation }: NavProps) => {
  const { t } = useTranslation('landing');
  const styles = useStyles();

  // -------- HOOKS --------

  const accountsAddresses = useStoredAccountsAddresses();
  const importNewAccounts = useImportNewAccounts([DesmosChain], accountsAddresses);
  const loginWithWeb3Auth = useLoginWithWeb3Auth(DesmosChain, accountsAddresses);
  const showModal = useShowModal();

  // -------- STATES --------

  const [tosAccepted, setToSAccepted] = React.useState(false);
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

  const showLegalSection = React.useMemo(
    () => accountsAddresses.length === 0,
    [accountsAddresses.length],
  );

  // -------- CALLBACKS --------

  const showAcceptLegalPopup = React.useCallback(() => {
    showModal(SingleButtonModal, {
      title: t('terms of service'),
      message: t('to use this application you must accept the ToS and the privacy policy'),
      actionLabel: t('common:ok'),
    });
  }, [showModal, t]);

  const onCreateAccount = React.useCallback(() => {
    if (showLegalSection && !tosAccepted) {
      showAcceptLegalPopup();
    } else {
      navigation.navigate(ROUTES.SELECT_NEW_MNEMONIC_LENGTH);
    }
  }, [navigation, showAcceptLegalPopup, showLegalSection, tosAccepted]);

  const onImportAccount = React.useCallback(async () => {
    if (showLegalSection && !tosAccepted) {
      showAcceptLegalPopup();
    } else {
      importNewAccounts();
    }
  }, [importNewAccounts, showAcceptLegalPopup, showLegalSection, tosAccepted]);

  const importFromSocial = React.useCallback(
    (social: Web3AuthLoginProvider) => {
      if (showLegalSection && !tosAccepted) {
        showAcceptLegalPopup();
      } else {
        loginWithWeb3Auth(social);
      }
    },
    [loginWithWeb3Auth, showAcceptLegalPopup, showLegalSection, tosAccepted],
  );

  const showOtherSocialLogin = React.useCallback(() => {
    if (showLegalSection && !tosAccepted) {
      showAcceptLegalPopup();
    } else {
      showModal(
        Web3AuthLoginProvidersModal,
        {
          onSelect: loginWithWeb3Auth,
        },
        {
          mode: ModalMode.BottomSheet,
        },
      );
    }
  }, [showLegalSection, tosAccepted, showAcceptLegalPopup, showModal, loginWithWeb3Auth]);

  const showToS = useShowToS();

  const showPrivacyPolicy = useShowPrivacyPolicy();

  const goBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // -------- EFFECTS --------

  React.useEffect(() => {
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

  return (
    <StyledSafeAreaView style={styles.root} noIosPadding>
      <ImageBackground source={landingBackground} resizeMode="stretch" style={styles.background}>
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
            <Typography.Regular16 style={styles.profileManagerText}>
              Desmos Profile Manager
            </Typography.Regular16>
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
              labelStyle={styles.buttonsLabel}
              mode="contained"
              color="#ffffff"
              onPress={onCreateAccount}
            >
              {t('create wallet')}
            </Button>

            <Spacer paddingVertical={12} />

            {/* Import wallet */}
            <Button
              style={styles.buttons}
              labelStyle={styles.buttonsLabel}
              mode="contained"
              color="#ffffff"
              onPress={onImportAccount}
            >
              {t('account:import account')}
            </Button>

            <Spacer paddingVertical={12} />

            <View style={styles.loginWithContainer}>
              <View style={styles.loginDivider} />
              <Spacer paddingHorizontal={8} />
              <Typography.Regular16 style={styles.loginWithLabel}>
                {t('or login with')}
              </Typography.Regular16>
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
        {showLegalSection && (
          <Animated.View
            style={{
              opacity: buttonsOpacity,
              ...styles.footer,
            }}
          >
            <DpmCheckBox status={tosAccepted} onPress={() => setToSAccepted(!tosAccepted)} />

            <Typography.Caption style={styles.legalText}>
              <Trans
                t={t}
                i18nKey={"i've read and accepted the tos and privacy policy"}
                components={{
                  tos: <Typography.Caption style={styles.clickableText} onPress={showToS} />,
                  privacy: (
                    <Typography.Caption style={styles.clickableText} onPress={showPrivacyPolicy} />
                  ),
                }}
              />
            </Typography.Caption>
          </Animated.View>
        )}

        <Spacer paddingVertical={24} />
      </ImageBackground>
    </StyledSafeAreaView>
  );
};

export default Landing;
