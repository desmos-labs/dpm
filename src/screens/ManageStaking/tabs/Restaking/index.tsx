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
import EmptyList from 'components/EmptyList';
import { DPMImages } from 'types/images';
import Button from 'components/Button';
import StyledRefreshControl from 'components/StyledRefreshControl';
import { useFetchAccountRedelegations } from './hooks';
import useStyeles from './useStyles';

/**
 * Component that shows the current active account's pending redelegations.
 */
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
    error: redelegationsError,
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
            <Typography.Body style={styles.totalDelegateddAmount}>
              {formatCoin(totalRedelegating!)}
            </Typography.Body>
          )}
        </View>
      )}

      <Spacer paddingVertical={8} />

      {/* User redelegations list */}
      <FlashList
        data={data}
        renderItem={renderItem}
        refreshControl={<StyledRefreshControl refreshing={refreshing} onRefresh={refreshData} />}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.4}
        estimatedItemSize={251}
        ListEmptyComponent={
          !loading && !refreshing ? (
            <EmptyList
              message={redelegationsError?.message ?? t("common:it's empty")}
              image={redelegationsError ? DPMImages.NoData : DPMImages.EmptyList}
              extraComponent={
                redelegationsError !== undefined && (
                  <Button mode={'outlined'} onPress={refreshData}>
                    {t('common:retry')}
                  </Button>
                )
              }
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

export default RestakingTab;
