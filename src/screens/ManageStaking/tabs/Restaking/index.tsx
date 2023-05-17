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
import { useFetchAccountRedelegations } from './hooks';

const RestakingTab: React.FC = () => {
  const { t } = useTranslation('restaking');
  const fecthRedelegations = useFetchAccountRedelegations();
  const { data, refresh, refreshing, loading, fetchMore, error } = usePaginatedData(
    fecthRedelegations,
    {
      itemsPerPage: 20,
    },
  );

  const renderItem = React.useCallback(
    (item: ListRenderItemInfo<Redelegation>) => (
      <>
        <RedelegationListItem redelegation={item.item} />
        <Spacer paddingVertical={8} />
      </>
    ),
    [],
  );

  return (
    <StyledSafeAreaView>
      <Typography.Body>{t('total restaking')}</Typography.Body>

      <Spacer paddingVertical={8} />

      {/* User redelegations list */}
      <FlashList
        renderItem={renderItem}
        data={data}
        onEndReached={fetchMore}
        refreshing={refreshing}
        onRefresh={refresh}
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
