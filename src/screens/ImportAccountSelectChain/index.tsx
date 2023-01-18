import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { SupportedChain } from 'types/chains';
import BlockchainListItem from 'components/BlockchainListItem';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import ListItemSeparator from 'components/ListItemSeparator';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import useOnBackAction from 'hooks/useOnBackAction';
import { useRecoilState } from 'recoil';
import { getChainSupportedWalletTypes } from 'lib/ChainsUtils';
import importAccountAppState, { ImportAccountState } from '@recoil/importAccountState';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.IMPORT_ACCOUNT_SELECT_CHAIN>;

const ImportAccountSelectChain: React.FC<NavProps> = ({ navigation }) => {
  const { t } = useTranslation('account');
  const styles = useStyles();

  const [importAccountState, setImportAccountState] = useRecoilState(importAccountAppState)!;
  const { chains, onCancel } = importAccountState!;

  useOnBackAction(() => {
    if (onCancel !== undefined) {
      onCancel();
    }
  }, [onCancel]);

  const onChainItemSelected = useCallback(
    (selectedChain: SupportedChain) => {
      setImportAccountState(
        (currentValue) =>
          ({
            ...currentValue,
            selectedChain,
            supportedImportMode: getChainSupportedWalletTypes(selectedChain),
          } as ImportAccountState),
      );
      navigation.navigate(ROUTES.IMPORT_ACCOUNT_SELECT_TYPE);
    },
    [navigation, setImportAccountState],
  );

  const renderListItem = useCallback(
    ({ item }: ListRenderItemInfo<SupportedChain>) => (
      <BlockchainListItem
        name={item.name}
        icon={item.icon}
        onPress={() => onChainItemSelected(item)}
      />
    ),
    [onChainItemSelected],
  );

  return (
    <StyledSafeAreaView
      style={styles.background}
      topBar={
        <TopBar style={styles.background} stackProps={{ navigation }} title={t('select chain')} />
      }
    >
      <FlatList
        style={styles.list}
        data={chains}
        renderItem={renderListItem}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ListItemSeparator}
      />
    </StyledSafeAreaView>
  );
};

export default ImportAccountSelectChain;
