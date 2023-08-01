import React from 'react';
import { View } from 'react-native';
import Typography from 'components/Typography';
import DpmImage from 'components/DPMImage';
import Button from 'components/Button';
import { ModalComponentProps } from 'modals/ModalScreen';
import { useTranslation } from 'react-i18next';
import { DPMImages } from 'types/images';
import DpmCheckBox from 'components/CheckBox';
import { useTheme } from 'react-native-paper';
import useStyles from './useStyles';
import { useClearAppData } from './hooks';

/**
 * This modal notifies the user that the data stored by the application
 * is corrupted and provides an option for them to fix it.
 */
const CorruptedKeychainModal: React.FC<ModalComponentProps<undefined>> = (props) => {
  const { closeModal } = props;
  const { t } = useTranslation('dataIntegrity');
  const theme = useTheme();
  const styles = useStyles();

  // -------- STATES --------

  const [checkBoxChecked, setCheckboxChecked] = React.useState(false);

  // -------- HOOKS --------

  const clearAppData = useClearAppData();

  // -------- CALLBACKS --------

  const onCheckBoxPressed = React.useCallback(() => {
    setCheckboxChecked((prevState) => !prevState);
  }, []);

  const btnAction = React.useCallback(() => {
    closeModal();
    clearAppData();
  }, [closeModal, clearAppData]);

  return (
    <View>
      <DpmImage style={styles.image} resizeMode="contain" source={DPMImages.TxFailed} />
      <Typography.SemiBold16 style={styles.title}>
        {t('keychain warning title')}
      </Typography.SemiBold16>
      <Typography.Regular16 style={styles.message}>
        {t('keychain warning description')}
      </Typography.Regular16>
      <View style={styles.checkboxContainer}>
        <DpmCheckBox
          status={checkBoxChecked}
          onPress={onCheckBoxPressed}
          color={theme.colors.primary}
        />
        <Typography.Regular16>{t('common:i understand')}</Typography.Regular16>
      </View>
      <Button
        style={styles.button}
        mode="contained"
        onPress={btnAction}
        disabled={!checkBoxChecked}
      >
        {t('fix keychain button')}
      </Button>
    </View>
  );
};

export default CorruptedKeychainModal;
