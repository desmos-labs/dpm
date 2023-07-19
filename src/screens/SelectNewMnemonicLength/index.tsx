import StyledSafeAreaView from 'components/StyledSafeAreaView';
import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';

import { MnemonicLength, SupportedMnemonicLengths } from 'types/mnemonic';
import DropdownPicker from 'components/DropodownPicker';
import Flexible from 'components/Flexible';
import Spacer from 'components/Spacer';
import DPMImage from 'components/DPMImage';
import { DPMImages } from 'types/images';
import useStyles from './useStyles';

declare type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.CREATE_NEW_MNEMONIC>;

const SelectNewMnemonicLength: React.FC<NavProps> = (props) => {
  const { navigation } = props;
  const styles = useStyles();
  const { t } = useTranslation('selectNewMnemonicLength');

  // -------- Screen states --------

  const [selectedLength, setSelectedLength] = React.useState<MnemonicLength>(24);

  // -------- Callbacks --------

  const navigateToCreateMnemonic = React.useCallback(() => {
    navigation.navigate(ROUTES.CREATE_NEW_MNEMONIC, {
      length: selectedLength,
    });
  }, [navigation, selectedLength]);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} />}>
      <DPMImage style={styles.image} source={DPMImages.Mnemonic} resizeMode={'contain'} />
      <Typography.H5 style={styles.centeredText} capitalize>
        {t('account:secret recovery passphrase')}
      </Typography.H5>
      <Typography.Regular14 style={styles.centeredText}>
        {t('select 12 or 24 words')}
      </Typography.Regular14>

      <Spacer paddingVertical={20} />

      <Typography.Regular16>{t('number of words')}</Typography.Regular16>
      <Spacer paddingVertical={4} />
      <DropdownPicker
        data={SupportedMnemonicLengths}
        onSelect={(value) => setSelectedLength(value)}
        defaultValue={selectedLength}
      />
      <Spacer paddingVertical={4} />
      <Typography.Regular14>{t('words number hint')}</Typography.Regular14>

      <Flexible.Padding flex={1} />
      <Button onPress={navigateToCreateMnemonic} mode={'contained'}>
        {t('common:next')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default SelectNewMnemonicLength;
