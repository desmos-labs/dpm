import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { DPMImages } from 'types/images';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { WalletType } from 'types/wallet';
import useOnBackAction from 'hooks/useOnBackAction';
import { useRecoilState } from 'recoil';
import importAccountAppState from '@recoil/importAccountState';
import Spacer from 'components/Spacer';
import ImageButton from './components/ImageButton';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.IMPORT_ACCOUNT_SELECT_TYPE>;

export interface ImportAccountSelectTypeParams {
  readonly title?: string;
  readonly description?: string;
}

const ImportAccountSelectType = (props: NavProps) => {
  const { t } = useTranslation('account');
  const { navigation } = props;
  const { params } = props.route;

  const [importAccountState, setImportAccountState] = useRecoilState(importAccountAppState);
  const { onCancel, chains } = importAccountState!;

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

  const title = useMemo(() => (params?.title ? params.title : t('connect chain')), [params, t]);
  const description = useMemo(
    () => (params?.description ? params.description : t('select connection method')),
    [params, t],
  );

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={{ navigation }} title={title} />}>
      {/* Description */}
      <Typography.Body>{description}</Typography.Body>

      <Spacer paddingVertical={10} />

      {/* Connect with Mnemonic button */}
      <ImageButton
        image={DPMImages.ConnectMnemonic}
        label={t('use secret recovery passphrase')}
        onPress={() => onImportModeSelected(WalletType.Mnemonic)}
      />

      <Spacer paddingVertical={20} />

      {/* Connect with Ledger button */}
      <ImageButton
        image={DPMImages.ConnectLedger}
        label={t('connect with ledger')}
        onPress={() => onImportModeSelected(WalletType.Ledger)}
      />
    </StyledSafeAreaView>
  );
};

export default ImportAccountSelectType;
