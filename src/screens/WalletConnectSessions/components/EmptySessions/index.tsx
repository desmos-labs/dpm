import React from 'react';
import DpmImage from 'components/DPMImage';
import { DPMImages } from 'types/images';
import Typography from 'components/Typography';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { QrCodeType } from 'screens/ScanQr';
import useStyles from './useStyles';

const EmptySessions = () => {
  const navigate = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const { t } = useTranslation('walletConnect');
  const styles = useStyles();

  const onAuthorize = React.useCallback(() => {
    navigate.navigate(ROUTES.SCAN_QR_CODE, {
      qrCodeType: QrCodeType.WalletConnect,
    });
  }, [navigate]);

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        {/* Icon */}
        <DpmImage style={styles.noDAppImage} source={DPMImages.NoConnection} resizeMode="contain" />

        {/* Message */}
        <Typography.Body1 style={styles.noDAppText}>
          {t('no authorization present')}
        </Typography.Body1>

        {/* Authorize button */}
        <Button mode="outlined" style={styles.authorizeButton} onPress={onAuthorize}>
          {t('authorize')}
        </Button>
      </View>
    </View>
  );
};

export default EmptySessions;
