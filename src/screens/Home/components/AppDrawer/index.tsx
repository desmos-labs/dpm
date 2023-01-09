import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import Button from 'components/Button';
import IconButton from 'components/IconButton';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import useDrawerContext from 'lib/AppDrawer/context';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileList } from 'screens/Home/components/AppDrawer/ProfileList';
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
    // TODO: Implement open settings logic
    console.warn('Implement - open settings');
    closeDrawer();
  }, [closeDrawer]);

  return (
    <StyledSafeAreaView>
      <IconButton style={styles.settingsBtn} icon="settings" onPress={openSettings} size={24} />
      <Image
        style={styles.desmosIcon}
        source={require('assets/images/desmosLogo-orange.png')}
        resizeMode="contain"
      />

      <View style={styles.accountsContainer}>
        <Typography.Subtitle>{t('accounts')}</Typography.Subtitle>

        <ProfileList />
      </View>

      <Button style={styles.addAccountBtn} mode="outlined" onPress={addAccount}>
        {t('add account')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default AppDrawerContent;
