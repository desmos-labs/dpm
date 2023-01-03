import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { debounce } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import {
  AccountScreensStackParams,
  ChainLinkScreensStackParams,
} from 'types/navigation';
import Typography from 'components/Typography';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import HdPathPicker from 'components/HdPathPicker';
import Divider from 'components/Divider';
import PaginatedFlatList from 'components/PaginatedFlatList';
import ListItemSeparator from 'components/ListItemSeparator';
import Flexible from 'components/Flexible';
import Button from 'components/Button';
import {Wallet} from 'types/wallet';
import useRenderListItem from './useHooks';
import useStyles from './useStyles';

export type Props = CompositeScreenProps<
  StackScreenProps<ChainLinkScreensStackParams, 'PickAddress'>,
  StackScreenProps<AccountScreensStackParams>
>;

const PickAddress: React.FC<Props> = (props) => {
  const { route } = props;
  const { importMode, chain, ledgerApp } =
    route.params;
  const { t } = useTranslation();
  const styles = useStyles();

  const defaultHdPath = useMemo(() => {
    return chain.hdPath;
  }, [chain.hdPath, importMode, ledgerApp]);
  const [selectedHdPath, setSelectedHdPath] = useState<any>(defaultHdPath);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [addressPickerVisible] = useState(false);

  const toggleAddressPicker = useCallback(() => {
  }, [selectedWallet, defaultHdPath]);

  const listKeyExtractor = useCallback((item: Wallet, _: number) => item.address, []);
  const renderListItem = useRenderListItem(selectedWallet, (hdPath, address, info) => {
    setSelectedWallet((old) => (old?.address === address ? null : info.item));
    setSelectedHdPath(hdPath);
  });

  const debouncedGenerateWallet = useCallback(debounce(async (_hdPath: any) => {
  }, 2000), []);

  const onHdPathChange = useCallback((hdPath: any) => {
    setSelectedWallet(null);
    setSelectedHdPath(hdPath);
    debouncedGenerateWallet(hdPath);
  }, [debouncedGenerateWallet]);

  const onNextPressed = useCallback(async () => {

  }, []);

  return (
    <StyledSafeAreaView
      style={styles.root}
      topBar={<TopBar stackProps={props} title={t('import account')} />}
    >
      <Typography.Body>{t('select account or enter derivation path')}.</Typography.Body>

      <Typography.Subtitle
        style={[styles.hpPathLabel, addressPickerVisible ? styles.disabledText : null]}
      >
        {t('enter derivation path')}.
      </Typography.Subtitle>
      <HdPathPicker
        style={styles.hdPathPicker}
        onChange={onHdPathChange}
        value={selectedHdPath}
        disabled={addressPickerVisible}
      />

      {!addressPickerVisible && (
        <Typography.Body style={styles.addressText}>
          {selectedWallet ? selectedWallet.address : `${t('generating address')}...`}
        </Typography.Body>
      )}

      <View style={styles.dividerContainer}>
        <Divider style={styles.dividerLine} />
        <Typography.Subtitle style={styles.dividerText}>{t('or')}</Typography.Subtitle>
        <Divider style={styles.dividerLine} />
      </View>

      <TouchableOpacity onPress={toggleAddressPicker}>
        <Typography.Subtitle
          style={[
            styles.toggleSelectAccount,
            !addressPickerVisible ? styles.toggleSelectAccountEnabled : null,
          ]}
        >
          {t('select account')}
        </Typography.Subtitle>
      </TouchableOpacity>

      {addressPickerVisible ? (
        <PaginatedFlatList
          style={styles.addressesList}
          loadPage={(_offset, _limit) => Promise.resolve([])}
          itemsPerPage={10}
          renderItem={renderListItem}
          keyExtractor={listKeyExtractor}
          onEndReachedThreshold={0.5}
          ItemSeparatorComponent={ListItemSeparator}
        />
      ) : (
        <Flexible.Padding flex={1} />
      )}
      <Button
        style={styles.nextButton}
        mode="contained"
        onPress={onNextPressed}
      >
        {t('next')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default PickAddress;
