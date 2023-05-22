import React from 'react';
import { View } from 'react-native';
import Typography from 'components/Typography';
import Spacer from 'components/Spacer';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import useActiveAccountBalance from 'hooks/useActiveAccountBalance';
import { useTranslation } from 'react-i18next';
import CopyButton from 'components/CopyButton';
import TypographyContentLoaders from 'components/ContentLoaders/Typography';
import { formatCoins } from 'lib/FormatUtils';
import useTotalDelegatedAmount from 'hooks/staking/useTotalDelegatedAmount';
import { Coin } from '@desmoslabs/desmjs';
import { sumCoins } from 'lib/CoinsUtils';
import useTotalAccountPendingStakingRewards from 'hooks/staking/useTotalAccountPendingStakingRewards';
import ListHeaderAction from 'screens/Home/components/ListHeaderAction';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import useStyles from './useStyles';

export interface ListHeaderProps {}

const ListHeader: React.FC<ListHeaderProps> = () => {
  const styles = useStyles();
  const { t } = useTranslation('account');
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  // --------- HOOKS --------
  const activeAccountAddress = useActiveAccountAddress()!;

  const { balance, loading: loadingBalance, refetch: refetchBalance } = useActiveAccountBalance();

  const {
    totalDelegated,
    loading: loadingTotalDelegated,
    refetch: refetchTotalDelegated,
  } = useTotalDelegatedAmount();

  const {
    data: stakingRewards,
    loading: loadingStakingRewards,
    refetch: refetchStakingRewards,
  } = useTotalAccountPendingStakingRewards();

  // -------- DATA --------

  const totalBalance = React.useMemo<Coin[]>(() => {
    if (loadingBalance || loadingTotalDelegated) {
      return [];
    }
    return sumCoins(balance, totalDelegated);
  }, [balance, loadingBalance, loadingTotalDelegated, totalDelegated]);

  // -------- CALLBACKS --------

  const onSendPressed = React.useCallback(() => {
    navigation.navigate(ROUTES.SEND_TOKENS);
  }, [navigation]);

  const onManagePressed = React.useCallback(() => {
    navigation.navigate(ROUTES.MANAGE_STAKING);
  }, [navigation]);

  return (
    <View style={styles.root}>
      {/* User address */}
      <View style={styles.addressContainer}>
        <Typography.Subtitle2 style={styles.address} numberOfLines={1} ellipsizeMode={'middle'}>
          {activeAccountAddress}
        </Typography.Subtitle2>
        <CopyButton value={activeAccountAddress} color={'#000000'} />
      </View>

      <Spacer paddingVertical={32} />

      {/* User total balance in fiat value */}
      <Typography.Subtitle2>{t('total balance')}</Typography.Subtitle2>
      <Typography.H1>amount $</Typography.H1>

      {/* Uset total tokens balance */}
      {loadingBalance || loadingTotalDelegated ? (
        <TypographyContentLoaders.Subtitle2 width={200} />
      ) : (
        <Typography.Subtitle2>{formatCoins(totalBalance)}</Typography.Subtitle2>
      )}

      <Spacer paddingVertical={25} />

      {/* User available tokens */}
      <ListHeaderAction
        label={t('common:available')}
        loading={loadingBalance}
        value={formatCoins(balance)}
        buttonText={t('common:send')}
        buttonAccent
        onButtonPressed={onSendPressed}
      />

      <Spacer paddingVertical={8} />

      {/* User pending staking rewards */}
      <ListHeaderAction
        label={t('staking:total staking rewards')}
        loading={loadingStakingRewards}
        value={formatCoins(stakingRewards)}
        buttonText={t('common:claim')}
      />

      <Spacer paddingVertical={8} />

      {/* User total staked amount */}
      <ListHeaderAction
        label={t('staking:total staked')}
        loading={loadingTotalDelegated}
        value={formatCoins(totalDelegated)}
        buttonText={t('common:manage')}
        buttonColor={'#1EC490'}
        onButtonPressed={onManagePressed}
      />

      <Spacer paddingVertical={25} />
    </View>
  );
};

export default ListHeader;
