import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { FC } from 'react';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { StackScreenProps } from '@react-navigation/stack';
import PaginatedFlatList, {
  ListRenderItemInfo,
} from 'screens/SelectAccount/components/PaginatedFlatList';
import { useFetchValidators } from 'screens/Stacking/useHooks';
import { Validator } from 'types/validator';
import ValidatorListItem from 'screens/Stacking/components/ValidatorItem';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.STACKING>;

const Staking: FC<NavProps> = (props) => {
  const loadValidatorPage = useFetchValidators();

  const renderValidator = React.useCallback(
    ({ item }: ListRenderItemInfo<Validator>) => <ValidatorListItem validator={item} />,
    [],
  );

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} />}>
      <PaginatedFlatList
        renderItem={renderValidator}
        loadPage={loadValidatorPage}
        itemsPerPage={50}
        estimatedItemSize={100}
      />
    </StyledSafeAreaView>
  );
};

export default Staking;
