import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, ImageBackground, Text, View } from 'react-native';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import IconButton from 'components/IconButton';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import useImportNewAccount from 'hooks/useImportNewAccount';
import { DesmosChain } from 'config/LinkableChains';
import {
  appleApplicationIcon,
  desmosLogoWhite,
  discordApplicationIcon,
  githubApplicationIcon,
  googleApplicationIcon,
  homeBackgroundLight,
  twitterApplicationIcon,
} from 'assets/images';
import { useStoredAccountsAddresses } from '@recoil/accounts';
import FastImage from 'react-native-fast-image';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { Web3AuthLoginProvider } from 'types/web3auth';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.LANDING>;

const Landing = ({ navigation }: NavProps) => {
  const { t } = useTranslation('landing');
  const styles = useStyles();

  const accountsAddresses = useStoredAccountsAddresses();
  const importNewAccount = useImportNewAccount([DesmosChain], accountsAddresses);

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
    importNewAccount();
  }, [importNewAccount]);

  const importFromSocial = useCallback((social: Web3AuthLoginProvider) => {
    // TODO: Implement login with social app.
    console.log('social login from', social);
  }, []);

  const showOtherSocialLogin = useCallback(() => {
    // TODO: show other supported login methods modal.
    console.log('showing social login');
  }, []);

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
          <FastImage style={styles.icon} source={desmosLogoWhite} resizeMode="contain" />
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

          <Spacer paddingVertical={12} />

          <Button style={styles.buttons} mode="outlined" color="#ffffff" onPress={onImportAccount}>
            {t('account:import account')}
          </Button>

          <Spacer paddingVertical={12} />

          <Typography.Subtitle style={styles.loginWithLabel}>
            {t('login with social app')} :
          </Typography.Subtitle>

          <Spacer paddingVertical={4} />

          {/* Social login buttons */}
          <View style={styles.socialButtonsContainer}>
            <IconButton
              style={styles.socialButton}
              icon={googleApplicationIcon}
              color={null}
              onPress={() => importFromSocial(Web3AuthLoginProvider.Google)}
            />
            <IconButton
              style={styles.socialButton}
              icon={appleApplicationIcon}
              color={null}
              onPress={() => importFromSocial(Web3AuthLoginProvider.Apple)}
            />
            <IconButton
              style={styles.socialButton}
              icon={twitterApplicationIcon}
              color={null}
              onPress={() => importFromSocial(Web3AuthLoginProvider.Twitter)}
            />
            <IconButton
              style={styles.socialButton}
              icon={discordApplicationIcon}
              color={null}
              onPress={() => importFromSocial(Web3AuthLoginProvider.Discord)}
            />
            <IconButton
              style={styles.socialButton}
              icon={githubApplicationIcon}
              color={null}
              onPress={() => importFromSocial(Web3AuthLoginProvider.Github)}
            />
          </View>
          <Spacer paddingVertical={4} />
          <Button style={styles.buttons} color="#ffffff" onPress={showOtherSocialLogin}>
            More
          </Button>
        </Animated.View>
      </ImageBackground>
    </StyledSafeAreaView>
  );
};

export default Landing;
