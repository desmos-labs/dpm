import React from 'react';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import Typography from 'components/Typography';
import { usePaginatedData } from 'hooks/usePaginatedData';
import { FlashList } from '@shopify/flash-list';
import { ListRenderItemInfo } from '@shopify/flash-list/src/FlashListProps';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import { Redelegation } from 'types/distribution';
import RedelegationListItem from 'screens/ManageStaking/tabs/Restaking/components/RedelegationListItem';
import Spacer from 'components/Spacer';
import { useTranslation } from 'react-i18next';
import useTotalRedelegatingAmount from 'hooks/staking/useTotalRedelegatingAmount';
import { View } from 'react-native';
import TypographyContentLoaders from 'components/ContentLoaders/Typography';
import { formatCoin } from 'lib/FormatUtils';
import { useFetchAccountRedelegations } from './hooks';
import useStyeles from './useStyles';

const RestakingTab: React.FC = () => {
  const { t } = useTranslation('restaking');
  const styles = useStyeles();
  const fecthRedelegations = useFetchAccountRedelegations();
  const {
    data: totalRedelegating,
    loading: loadingTotalRedelegating,
    error: errorTotalRedelegating,
    refetch: refreshTotalRedelegatingAmount,
  } = useTotalRedelegatingAmount();
  const {
    data,
    refresh: refreshDelegations,
    refreshing,
    loading,
    fetchMore,
    error,
  } = usePaginatedData(fecthRedelegations, {
    itemsPerPage: 20,
  });

  const renderItem = React.useCallback(
    (item: ListRenderItemInfo<Redelegation>) => (
      <>
        <RedelegationListItem redelegation={item.item} />
        <Spacer paddingVertical={8} />
      </>
    ),
    [],
  );

  const refreshData = React.useCallback(() => {
    refreshDelegations();
    refreshTotalRedelegatingAmount();
  }, [refreshDelegations, refreshTotalRedelegatingAmount]);

  return (
    <StyledSafeAreaView>
      {/* Total redelegating amount */}
      {errorTotalRedelegating === undefined && (
        <View style={styles.totalRestaking}>
          <Typography.Body>{t('total restaking')}</Typography.Body>
          <Spacer paddingHorizontal={8} />
          {loadingTotalRedelegating ? (
            <TypographyContentLoaders.Body width={200} />
          ) : (
            <Typography.Body style={{ fontWeight: 'bold' }}>
              {formatCoin(totalRedelegating!)}
            </Typography.Body>
          )}
        </View>
      )}

      <Spacer paddingVertical={8} />

      {/* User redelegations list */}
      <FlashList
        renderItem={renderItem}
        data={data}
        onEndReached={fetchMore}
        refreshing={refreshing}
        onRefresh={refreshData}
        estimatedItemSize={251}
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

export default RestakingTab;
