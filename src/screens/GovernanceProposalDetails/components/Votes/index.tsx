import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchProposalVotes } from 'screens/GovernanceProposalDetails/components/Votes/hooks';
import { FlashList } from '@shopify/flash-list';
import { View } from 'react-native';
import Typography from 'components/Typography';
import { ListRenderItem } from '@shopify/flash-list/src/FlashListProps';
import { ProposalVote } from 'types/proposals';
import EmptyList from 'components/EmptyList';
import { DPMImages } from 'types/images';
import Button from 'components/Button';
import StyledActivityIndicator from 'components/StyledActivityIndicator';

export interface VotesProps {
  readonly proposalId: number;
}

const Votes: React.FC<VotesProps> = ({ proposalId }) => {
  const { t } = useTranslation('governance');

  const { data, loading, fetchMore, error, refreshing, refresh } =
    useFetchProposalVotes(proposalId);

  const renderListItem = React.useCallback<ListRenderItem<ProposalVote>>(
    (item) => (
      <View>
        <Typography.SemiBold14>{item.item.voterAddress}</Typography.SemiBold14>
        <Typography.SemiBold14>{item.item.option}</Typography.SemiBold14>
      </View>
    ),
    [],
  );

  return (
    <View style={{ minHeight: 600 }}>
      <FlashList
        nestedScrollEnabled
        data={data}
        renderItem={renderListItem}
        onEndReached={fetchMore}
        refreshing={refreshing}
        onRefresh={refresh}
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
    </View>
  );
};

export default Votes;
