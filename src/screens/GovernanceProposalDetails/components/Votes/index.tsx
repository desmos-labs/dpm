import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchProposalVotes } from 'screens/GovernanceProposalDetails/components/Votes/hooks';
import { ListRenderItem } from '@shopify/flash-list/src/FlashListProps';
import { ProposalVote } from 'types/proposals';
import EmptyList from 'components/EmptyList';
import { DPMImages } from 'types/images';
import Button from 'components/Button';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import VoteListItem from 'screens/GovernanceProposalDetails/components/VoteListItem';
import Spacer from 'components/Spacer';
import StyledRefreshControl from 'components/StyledRefreshControl';
import { Tabs } from 'react-native-collapsible-tab-view';

export interface VotesProps {
  readonly proposalId: number;
}

const Votes: React.FC<VotesProps> = ({ proposalId }) => {
  const { t } = useTranslation('governance');

  const { data, loading, fetchMore, error, refreshing, refresh } =
    useFetchProposalVotes(proposalId);

  const renderListItem = React.useCallback<ListRenderItem<ProposalVote>>(
    (item) => (
      <>
        <VoteListItem proposalVote={item.item} />
        <Spacer paddingVertical={8} />
      </>
    ),
    [],
  );

  React.useEffect(() => {
    fetchMore();

    // Safe to ignore, we want to perform the first fetch
    // since the FlatList don't call this method when is empty.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Tabs.FlatList
      data={data}
      renderItem={renderListItem}
      onEndReached={fetchMore}
      refreshControl={<StyledRefreshControl refreshing={refreshing} onRefresh={refresh} />}
      estimatedItemSize={100}
      onEndReachedThreshold={0.4}
      ListEmptyComponent={
        !loading && !refreshing ? (
          <EmptyList
            message={error?.message ?? t('no votes')}
            image={error !== undefined ? DPMImages.NoData : DPMImages.EmptyList}
            extraComponent={
              error !== undefined ? (
                <Button mode={'outlined'} onPress={refresh}>
                  {t('common:retry')}
                </Button>
              ) : undefined
            }
          />
        ) : null
      }
      ListFooterComponent={loading ? <StyledActivityIndicator /> : undefined}
    />
  );
};

export default Votes;
