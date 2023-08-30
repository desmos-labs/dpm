import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from 'react-native-paper';
import { ModalComponentProps } from 'modals/ModalScreen';
import Button from 'components/Button';
import Clipboard from '@react-native-community/clipboard';
import { useShowSnackBar } from 'lib/SnackBarProvider/recoil';
import { useCurrentChainType } from '@recoil/settings';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import Spacer from 'components/Spacer';
import { useGenerateQrCodeUrl } from 'modals/QRCodeAddressModal/hooks';
import useStyles from './useStyles';

export interface QRCodeAddressProps {
  /**
   * The address to show.
   */
  readonly address: string;
}

/**
 * Modal that displays an address as a QR code.
 */
const QRCodeAddressModal: React.FC<ModalComponentProps<QRCodeAddressProps>> = ({ params }) => {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('common');
  const { address } = params;

  const chainType = useCurrentChainType();
  const showSnackBar = useShowSnackBar();
  const { loading, url, error, regenerate } = useGenerateQrCodeUrl(address, chainType);

  // -------- CALLBACKS --------

  const onCopyPressed = React.useCallback(() => {
    Clipboard.setString(address);
    showSnackBar(t('value copied'));
  }, [address, showSnackBar, t]);

  // -------- COMPONENTS ---------

  const qrCodeView = React.useMemo(() => {
    if (loading) {
      return (
        <View>
          <Typography.Regular16>{t('generating')}</Typography.Regular16>
          <Spacer paddingVertical={8} />
          <StyledActivityIndicator />
        </View>
      );
    }
    if (url) {
      return (
        <View style={styles.qrCodeView}>
          <QRCode
            size={200}
            color={theme.colors.primary}
            backgroundColor={theme.colors.background}
            value={url}
          />
        </View>
      );
    }

    return (
      <View>
        <Typography.Regular16>{error?.toString()}</Typography.Regular16>
        <Spacer paddingVertical={8} />
        <Button mode={'contained'} onPress={regenerate}>
          {t('retry')}
        </Button>
      </View>
    );
  }, [
    loading,
    url,
    error,
    regenerate,
    t,
    styles.qrCodeView,
    theme.colors.primary,
    theme.colors.background,
  ]);

  return (
    <View style={styles.root}>
      <Typography.SemiBold16 capitalize>{t('my address')}</Typography.SemiBold16>

      <Spacer paddingVertical={12} />

      {qrCodeView}
      <Typography.Regular14 style={styles.addressContainer} numberOfLines={2}>
        {address}
      </Typography.Regular14>
      <Button style={styles.copyButton} mode="outlined" onPress={onCopyPressed}>
        {t('copy address')}
      </Button>
    </View>
  );
};

export default QRCodeAddressModal;
