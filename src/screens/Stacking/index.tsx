import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { FC } from 'react';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { StackScreenProps } from '@react-navigation/stack';
import { ListRenderItemInfo } from 'screens/SelectAccount/components/PaginatedFlatList';
import { useFetchValidators } from 'screens/Stacking/useHooks';
import { Validator } from 'types/validator';
import ValidatorListItem from 'screens/Stacking/components/ValidatorItem';
import { FlashList } from '@shopify/flash-list';
import { usePaginatedData } from 'hooks/usePaginatedData';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import TextInput from 'components/TextInput';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.STACKING>;

const Staking: FC<NavProps> = (props) => {
  const loadValidatorPage = useFetchValidators();
  const { data, loading, fetchMore, refresh, refreshing, updateFilter } = usePaginatedData(
    loadValidatorPage,
    { itemsPerPage: 50, updateFilterDebounceTimeMs: 500 },
    {
      text: '',
      votingPowerOrder: 'desc',
    },
  );

  const renderValidator = React.useCallback(
    ({ item }: ListRenderItemInfo<Validator>) => <ValidatorListItem validator={item} />,
    [],
  );

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} />}>
      <TextInput
        onChangeText={(e) => {
          updateFilter((currentFilter) => ({
            ...currentFilter,
            text: e.trim(),
          }));
        }}
      />

      <FlashList
        data={data}
        renderItem={renderValidator}
        refreshing={refreshing}
        onRefresh={refresh}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.8}
        estimatedItemSize={100}
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

export default Staking;
