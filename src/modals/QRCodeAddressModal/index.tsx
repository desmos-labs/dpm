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
import { generateDPMUri } from 'lib/DPMUris';
import { DPMUriType } from 'types/uri';
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

  const showSnackBar = useShowSnackBar();

  // -------- VARIABLES --------

  const qrCodeData = React.useMemo(
    () =>
      generateDPMUri({
        type: DPMUriType.UserAddress,
        address,
      }),
    [address],
  );

  // -------- CALLBACKS --------

  const onCopyPressed = React.useCallback(() => {
    Clipboard.setString(address);
    showSnackBar(t('value copied'));
  }, [address, showSnackBar, t]);

  return (
    <View style={styles.root}>
      <Typography.SemiBold16 capitalize>{t('my address')}</Typography.SemiBold16>
      <View style={styles.qrCodeView}>
        <QRCode
          size={200}
          color={theme.colors.primary}
          backgroundColor={theme.colors.background}
          value={qrCodeData}
        />
      </View>
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
