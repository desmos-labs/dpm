import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { DPMImages } from 'types/images';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { WalletType } from 'types/wallet';
import { FlatList, ListRenderItemInfo } from 'react-native';
import useOnBackAction from 'hooks/useOnBackAction';
import { useRecoilState } from 'recoil';
import importAccountAppState from '@recoil/importAccountState';
import useStyles from './useStyles';
import ImageButton from './components/ImageButton';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.IMPORT_ACCOUNT_SELECT_TYPE>;

const ImportAccountSelectType: React.FC<NavProps> = ({ navigation }) => {
  const [importAccountState, setImportAccountState] = useRecoilState(importAccountAppState);
  const { onCancel, chains, supportedImportMode } = importAccountState!;
  const { t } = useTranslation('account');
  const styles = useStyles();

  useOnBackAction(() => {
    if (onCancel !== undefined && chains.length === 1) {
      onCancel();
    }
  }, [onCancel]);

  const onImportModeSelected = useCallback(
    (importMode: WalletType) => {
      setImportAccountState((old) => ({
        ...old!,
        importMode,
      }));
      if (importMode === WalletType.Mnemonic) {
        navigation.navigate({
          name: ROUTES.IMPORT_ACCOUNT_FROM_MNEMONIC,
          params: undefined,
        });
      } else {
        navigation.navigate({
          name: ROUTES.IMPORT_ACCOUNT_SELECT_LEDGER_APP,
          params: undefined,
        });
      }
    },
    [setImportAccountState, navigation],
  );

  const renderWalletTypeItem = useCallback(
    (item: ListRenderItemInfo<WalletType>) => {
      let label: string;
      let image: DPMImages;
      switch (item.item) {
        case WalletType.Mnemonic:
          label = t('use secret recovery passphrase');
          image = DPMImages.ConnectChain;
          break;
        case WalletType.Ledger:
          label = t('connect with ledger');
          image = DPMImages.ConnectLedger;
          break;
        default:
          console.error(`rendering an unsupported wallet type ${item.item}`);
          return null;
      }

      return (
        <ImageButton
          style={styles.topMargin}
          image={image}
          label={label}
          onPress={() => onImportModeSelected(item.item)}
        />
      );
    },
    [t, onImportModeSelected],
  );

  return (
    <StyledSafeAreaView
      style={styles.background}
      topBar={
        <TopBar style={styles.background} stackProps={{ navigation }} title={t('connect chain')} />
      }
    >
      <Typography.Body>{t('select connection method')}</Typography.Body>
      <FlatList data={supportedImportMode!} renderItem={renderWalletTypeItem} />
    </StyledSafeAreaView>
  );
};

export default ImportAccountSelectType;
