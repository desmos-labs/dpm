import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { FC } from 'react';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { StackScreenProps } from '@react-navigation/stack';
import { ListRenderItemInfo } from 'screens/SelectAccount/components/PaginatedFlatList';
import { Validator } from 'types/validator';
import { FlashList } from '@shopify/flash-list';
import { usePaginatedData } from 'hooks/usePaginatedData';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import TextInput from 'components/TextInput';
import { useTranslation } from 'react-i18next';
import Spacer from 'components/Spacer';
import EmptyList from 'components/EmptyList';
import { DPMImages } from 'types/images';
import ValidatorListItem from './components/ValidatorListItem';
import { useFetchValidators } from './hooks';

export interface SelectValidatorParams {
  onValidatorSelected?: (validator: Validator) => any;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SELECT_VALIDATOR>;

const SelectValidator: FC<NavProps> = (props) => {
  const { onValidatorSelected } = props.route.params;
  const { t } = useTranslation('selectValidator');
  const loadValidatorPage = useFetchValidators();
  const { data, loading, fetchMore, refresh, refreshing, updateFilter, error } = usePaginatedData(
    loadValidatorPage,
    { itemsPerPage: 50, updateFilterDebounceTimeMs: 500 },
    {
      moniker: '',
      votingPowerOrder: 'desc',
    },
  );

  const renderValidator = React.useCallback(
    ({ item }: ListRenderItemInfo<Validator>) => (
      <>
        <ValidatorListItem validator={item} onPress={onValidatorSelected} />
        <Spacer paddingVertical={4} />
      </>
    ),
    [onValidatorSelected],
  );

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} title={t('active validators')} />}>
      <TextInput
        onChangeText={(e) => {
          updateFilter((currentFilter) => ({
            ...currentFilter,
            moniker: e.trim(),
          }));
        }}
        placeholder={t('search validator')}
      />

      <Spacer paddingVertical={8} />

      <FlashList
        data={data}
        renderItem={renderValidator}
        refreshing={refreshing}
        onRefresh={refresh}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.8}
        estimatedItemSize={100}
        ListEmptyComponent={
          !loading && !refreshing ? (
            <EmptyList message={error?.message ?? t('no results')} image={DPMImages.NoData} />
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

export default SelectValidator;
