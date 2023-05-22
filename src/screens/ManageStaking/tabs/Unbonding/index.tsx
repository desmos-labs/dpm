import React from 'react';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import Typography from 'components/Typography';
import useTotalUnbondingAmount from 'hooks/staking/useTotalUnbondingAmount';
import Spacer from 'components/Spacer';
import TypographyContentLoaders from 'components/ContentLoaders/Typography';
import { formatCoins } from 'lib/FormatUtils';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useGetFetchUnbondingDelegations } from 'screens/ManageStaking/tabs/Unbonding/hooks';
import { usePaginatedData } from 'hooks/usePaginatedData';
import { FlashList } from '@shopify/flash-list';
import EmptyList from 'components/EmptyList';
import { DPMImages } from 'types/images';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import { ListRenderItemInfo } from '@shopify/flash-list/src/FlashListProps';
import { UnbondingDelegation } from 'types/distribution';
import UnbondingDelegationListItem from 'screens/ManageStaking/tabs/Unbonding/components/UnbondingDelegationListItem';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import Button from 'components/Button';
import useStyles from './useStyles';

/**
 * Component that shows the current active account's unbonding delegations.
 */
const UnbondingTab: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootNavigatorParamList>>();
  const { t } = useTranslation('unbonding');
  const styles = useStyles();

  // -------- HOOKS --------

  const {
    totalUnbonding,
    loading: loadingTotalUnbonding,
    refetch: refreshTotalUnbondingAmount,
  } = useTotalUnbondingAmount();

  const fetchUnbondigDelegations = useGetFetchUnbondingDelegations();
  const {
    data: unbondingDelegations,
    loading: loadingUnbondingDelegations,
    error: errorUnbondingDelegations,
    refreshing: refreshingUnbondingDelegations,
    refresh: refreshUnbondingDelegations,
    fetchMore: fetchMoreUnbondingDelegations,
  } = usePaginatedData(fetchUnbondigDelegations, {
    itemsPerPage: 20,
  });

  // -------- CALLBACKS --------

  const onUnbondingDelegationPressed = React.useCallback(
    (unbondingDelegation: UnbondingDelegation) => {
      navigation.navigate(ROUTES.VALIDATOR_STAKING_INFO, {
        validatorOperatorAddress: unbondingDelegation.validatorAddress,
      });
    },
    [navigation],
  );

  const renderItem = React.useCallback(
    (itemInfo: ListRenderItemInfo<UnbondingDelegation>) => (
      <>
        <UnbondingDelegationListItem
          unbondingDelegation={itemInfo.item}
          onPress={onUnbondingDelegationPressed}
        />
        <Spacer paddingVertical={8} />
      </>
    ),
    [onUnbondingDelegationPressed],
  );

  const refreshData = React.useCallback(() => {
    refreshTotalUnbondingAmount();
    refreshUnbondingDelegations();
  }, [refreshTotalUnbondingAmount, refreshUnbondingDelegations]);

  return (
    <StyledSafeAreaView>
      {/* Total amount of coins currently unbonding */}
      <View style={styles.totalUnbonding}>
        <Typography.Body>{t('total unbonding')}</Typography.Body>
        <Spacer paddingHorizontal={8} />
        {loadingTotalUnbonding ? (
          <TypographyContentLoaders.Body width={200} />
        ) : (
          <Typography.Body style={styles.totalUnbondingAmount}>
            {formatCoins(totalUnbonding)}
          </Typography.Body>
        )}
      </View>

      <Spacer paddingVertical={8} />

      {/* User unbonding delegations list */}
      <FlashList
        data={unbondingDelegations}
        renderItem={renderItem}
        refreshing={refreshingUnbondingDelegations}
        onRefresh={refreshData}
        onEndReached={fetchMoreUnbondingDelegations}
        onEndReachedThreshold={0.4}
        estimatedItemSize={251}
        ListEmptyComponent={
          !loadingUnbondingDelegations && !refreshingUnbondingDelegations ? (
            <EmptyList
              message={errorUnbondingDelegations?.message ?? t("common:it's empty")}
              image={errorUnbondingDelegations ? DPMImages.NoData : DPMImages.EmptyList}
              extraComponent={
                errorUnbondingDelegations !== undefined && (
                  <Button mode="outlined" onPress={refreshData}>
                    {t('common:retry')}
                  </Button>
                )
              }
            />
          ) : null
        }
        ListFooterComponent={
          <StyledActivityIndicator
            animating={loadingUnbondingDelegations && !refreshingUnbondingDelegations}
            hidesWhenStopped
            size="small"
          />
        }
      />
    </StyledSafeAreaView>
  );
};

export default UnbondingTab;
