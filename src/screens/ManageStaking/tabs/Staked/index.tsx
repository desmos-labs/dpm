import React from 'react';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import Typography from 'components/Typography';
import useTotalDelegatedAmount from 'hooks/staking/useTotalDelegatedAmount';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { formatCoins } from 'lib/FormatUtils';
import TypographyContentLoaders from 'components/ContentLoaders/Typography';
import Spacer from 'components/Spacer';
import { usePaginatedData } from 'hooks/usePaginatedData';
import { useFetchDelegations } from 'screens/ManageStaking/tabs/Staked/hooks';
import { FlashList } from '@shopify/flash-list';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import { ListRenderItemInfo } from '@shopify/flash-list/src/FlashListProps';
import { Delegation } from 'types/distribution';
import EmptyList from 'components/EmptyList';
import { useCurrentChainInfo } from '@recoil/settings';
import { DPMImages } from 'types/images';
import DelegationListItem from './components/DelegationListItem';
import useStyles from './useStyles';

const StakedTab: React.FC = () => {
  const { t } = useTranslation('manageStaking');
  const styles = useStyles();

  const currentChainInfo = useCurrentChainInfo();
  const {
    totalDelegated,
    loading: totalDelegatedLoading,
    error: totalDelegatedError,
    refetch: refetchTotalDelegatedAmount,
  } = useTotalDelegatedAmount();

  const fetchDelegations = useFetchDelegations();
  const {
    data,
    loading,
    fetchMore,
    refresh: refreshDelegations,
    refreshing,
    error: delegationsError,
  } = usePaginatedData(fetchDelegations, {
    itemsPerPage: 50,
  });

  const renderDelegation = React.useCallback(
    (itemInfo: ListRenderItemInfo<Delegation>) => (
      <>
        <DelegationListItem delegation={itemInfo.item} />
        <Spacer paddingVertical={8} />
      </>
    ),
    [],
  );

  const refreshData = React.useCallback(() => {
    refreshDelegations();
    refetchTotalDelegatedAmount();
  }, [refetchTotalDelegatedAmount, refreshDelegations]);

  return (
    <StyledSafeAreaView>
      {/* Total staked amount */}
      {totalDelegatedError === undefined && (
        <View style={styles.totalStaked}>
          <Typography.Body>{t('total staked')}</Typography.Body>
          <Spacer paddingHorizontal={8} />
          {totalDelegatedLoading ? (
            <TypographyContentLoaders.Body width={200} />
          ) : (
            <Typography.Body style={styles.totalStakedAmount}>
              {formatCoins(totalDelegated)}
            </Typography.Body>
          )}
        </View>
      )}

      <Spacer paddingVertical={8} />

      {/* Delegation list */}
      <FlashList
        data={data}
        renderItem={renderDelegation}
        refreshing={refreshing}
        onRefresh={refreshData}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.4}
        estimatedItemSize={148}
        ListEmptyComponent={
          !loading && !refreshing ? (
            <EmptyList
              message={
                delegationsError?.message ??
                t("you haven't staked any coin yes", {
                  coin: currentChainInfo.stakeCurrency.coinDenom,
                })
              }
              image={delegationsError ? DPMImages.NoData : DPMImages.EmptyList}
            />
          ) : null
        }
        ListFooterComponent={
          <StyledActivityIndicator
            animating={loading && !refreshing}
            hidesWhenStopped
            size="small"
          />
        }
      />
    </StyledSafeAreaView>
  );
};

export default StakedTab;
