import React, { useCallback } from 'react';
import { View } from 'react-native';
import Typography from 'components/Typography';
import { ModalComponentProps } from 'modals/ModalScreen';
import { Web3AuthLoginProvider } from 'types/web3auth';
import { useTranslation } from 'react-i18next';
import { FlashList } from '@shopify/flash-list';
import { ListRenderItemInfo } from '@shopify/flash-list/src/FlashListProps';
import ListItemSeparator from 'components/ListItemSeparator';
import Spacer from 'components/Spacer';
import LoginProviderListItem from 'modals/Web3AuthLoginProvidersModal/components/LoginProviderListItem';
import { IconButton } from 'react-native-paper';
import useStyles from './useStyles';

export type Web3AuthLoginProviderParams = {
  onSelect: (loginProvider: Web3AuthLoginProvider) => any;
};

const Web3AuthLoginProvidersModal: React.FC<ModalComponentProps<Web3AuthLoginProviderParams>> = (
  props,
) => {
  const { params, closeModal } = props;
  const { onSelect } = params;
  const styles = useStyles();
  const { t } = useTranslation('web3auth');

  const renderItem = useCallback(
    (info: ListRenderItemInfo<Web3AuthLoginProvider>) => {
      const { item } = info;
      return (
        <LoginProviderListItem
          loginProvider={item}
          onPress={() => {
            onSelect(item);
            closeModal();
          }}
        />
      );
    },
    [onSelect, closeModal],
  );

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View>
          <Typography.H6>{t('more options')}</Typography.H6>
          <Typography.Regular16>{t('select login provider')}</Typography.Regular16>
        </View>
        <IconButton icon={'close'} onPress={closeModal} color={'#5C5C5C'} />
      </View>

      <Spacer paddingVertical={8} />

      <FlashList
        data={Object.values(Web3AuthLoginProvider)}
        renderItem={renderItem}
        estimatedItemSize={40}
        ItemSeparatorComponent={ListItemSeparator}
      />
    </View>
  );
};

export default Web3AuthLoginProvidersModal;
