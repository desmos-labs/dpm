import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Button from 'components/Button';
import IconButton from 'components/IconButton';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import useDrawerContext from 'lib/AppDrawer/context';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileList } from 'screens/Home/components/AppDrawer/ProfileList';
import { desmosLogoOrange } from 'assets/images';
import FastImage from 'react-native-fast-image';
import useStyles from './useStyles';

const AppDrawerContent = () => {
  const { closeDrawer } = useDrawerContext();
  const { t } = useTranslation();
  const styles = useStyles();
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  const addAccount = useCallback(() => {
    closeDrawer();
    navigator.navigate(ROUTES.LANDING);
  }, [closeDrawer, navigator]);

  const openSettings = useCallback(() => {
    closeDrawer();
    navigator.navigate(ROUTES.SETTINGS);
  }, [closeDrawer, navigator]);

  return (
    <StyledSafeAreaView paddingVertical={24}>
      <View style={styles.topSection}>
        <FastImage style={styles.desmosIcon} source={desmosLogoOrange} resizeMode="contain" />
        <IconButton style={styles.settingsBtn} icon="settings" onPress={openSettings} size={24} />
      </View>

      <View style={styles.accountsContainer}>
        <Typography.Subtitle>{t('account:accounts')}</Typography.Subtitle>
        <ProfileList />
      </View>

      <Button style={styles.addAccountBtn} mode="outlined" onPress={addAccount}>
        {t('account:add account')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default AppDrawerContent;
