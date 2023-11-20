import React, { MutableRefObject } from 'react';
import { View } from 'react-native';
import Typography from 'components/Typography';
import Spacer from 'components/Spacer';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import useActiveAccountBalance from 'hooks/useActiveAccountBalance';
import { useTranslation } from 'react-i18next';
import CopyButton from 'components/CopyButton';
import TypographyContentLoaders from 'components/ContentLoaders/Typography';
import { formatCoins, formatFiatAmount, safeParseFloat } from 'lib/FormatUtils';
import useTotalDelegatedAmount from 'hooks/staking/useTotalDelegatedAmount';
import { Coin } from '@desmoslabs/desmjs';
import { sumCoins } from 'lib/CoinsUtils';
import useTotalAccountPendingStakingRewards from 'hooks/staking/useTotalAccountPendingStakingRewards';
import AccountBalancesAction from 'screens/Home/components/AccountBalancesAction';
import { useNavigation } from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import useBalanceFiatAmount from 'hooks/balance/useCoinsFiatAmouont';
import useStakeFlow from 'hooks/staking/useStakeFlow';
import { HomeTabsNavigationProp } from 'navigation/RootNavigator/HomeTabs/props';
import { useSetSetting, useSetting } from '@recoil/settings';
import IconButton from 'components/IconButton';
import useShowModal from 'hooks/useShowModal';
import QRCodeAddressModal from 'modals/QRCodeAddressModal';
import { ModalMode } from 'modals/ModalScreen';
import { qrCodeIcon } from 'assets/images';
import useStyles from './useStyles';
import { useClaimAllRewards } from './hooks';

/**
 * Interface to interact with this component from a parent component.
 */
export interface AccountBalanceRef {
  /**
   * Updates the displayed balances.
   */
  updateBalances(): void;
}

interface AccountBalancesProps {
  /**
   * Reference to this component.
   */
  readonly reference?: MutableRefObject<AccountBalanceRef | undefined>;
}

/**
 * Component that shows those information of the current active account:
 * - Total balance in fiat value;
 * - Total balance in tokens;
 * - Total available tokens;
 * - Total amount of token staked;
 * - Total pending staking rewards.
 * This component also allows the user to perform the following actions:
 * - Send some coins;
 * - Stake some coins if the user don't have any delegation;
 * - Manage the delegations if the user have at least one delegation;
 * - Claim all the pending staking rewards.
 */
const AccountBalances: React.FC<AccountBalancesProps> = ({ reference }) => {
  const styles = useStyles();
  const { t } = useTranslation('account');
  const navigation = useNavigation<HomeTabsNavigationProp<ROUTES.HOME>>();

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
  const startStakeFlow = useStakeFlow();
  const claimAllRewards = useClaimAllRewards();
  const hideBalance = useSetting('hideBalance');
  const setHideBalance = useSetSetting('hideBalance');
  const showModal = useShowModal();

  // -------- DATA --------

  const totalBalance = React.useMemo<Coin[]>(() => {
    if (loadingBalance || loadingTotalDelegated) {
      return [];
    }
    return sumCoins(balance, totalDelegated);
  }, [balance, loadingBalance, loadingTotalDelegated, totalDelegated]);

  const {
    amount: fiatAmount,
    symbol: fiatSymbol,
    loading: loadingFiatAmount,
  } = useBalanceFiatAmount(totalBalance);

  const userHaveDelegations = React.useMemo(() => {
    if (loadingTotalDelegated || totalDelegated === undefined) {
      return false;
    }

    return totalDelegated.length >= 1 && safeParseFloat(totalDelegated[0].amount, 'en-US') > 0;
  }, [loadingTotalDelegated, totalDelegated]);

  const totalStakedButtonText = React.useMemo(() => {
    if (loadingTotalDelegated || totalDelegated === undefined) {
      return '...';
    }

    return userHaveDelegations ? t('common:manage') : t('staking:stake');
  }, [loadingTotalDelegated, t, totalDelegated, userHaveDelegations]);

  // -------- CALLBACKS --------

  const onSendPressed = React.useCallback(() => {
    navigation.navigate(ROUTES.SEND_TOKENS);
  }, [navigation]);

  const onTotalStakedButtonPressed = React.useCallback(() => {
    if (loadingTotalDelegated || totalDelegated === undefined) {
      return;
    }

    if (userHaveDelegations) {
      navigation.navigate(ROUTES.MANAGE_STAKING);
    } else {
      startStakeFlow();
    }
  }, [loadingTotalDelegated, navigation, startStakeFlow, totalDelegated, userHaveDelegations]);

  const refreshData = React.useCallback(() => {
    refetchBalance();
    refetchTotalDelegated();
    refetchStakingRewards();
  }, [refetchBalance, refetchStakingRewards, refetchTotalDelegated]);

  const onClaimAllRewards = React.useCallback(() => {
    claimAllRewards();
  }, [claimAllRewards]);

  const showAddressQRCode = React.useCallback(() => {
    showModal(
      QRCodeAddressModal,
      {
        address: activeAccountAddress,
      },
      {
        mode: ModalMode.BottomSheet,
      },
    );
  }, [showModal, activeAccountAddress]);

  // -------- EFFECTS --------

  React.useEffect(() => {
    if (reference !== undefined) {
      // eslint-disable-next-line no-param-reassign
      reference.current = {
        updateBalances: refreshData,
      };
    }
    return () => {
      if (reference !== undefined) {
        // eslint-disable-next-line no-param-reassign
        reference.current = undefined;
      }
    };
  }, [reference, refreshData]);

  return (
    <View style={styles.root}>
      {/* User address */}
      <View style={styles.addressContainer}>
        <Typography.Regular14 style={styles.address} numberOfLines={1} ellipsizeMode={'middle'}>
          {activeAccountAddress}
        </Typography.Regular14>
        <CopyButton style={styles.iconButton} value={activeAccountAddress} />
        <IconButton
          style={styles.iconButton}
          icon={qrCodeIcon}
          onPress={showAddressQRCode}
          size={20}
        />
      </View>

      <Spacer paddingVertical={24} />

      {/* User total balance in fiat value */}
      <View style={styles.totalBalanceLabelContainer}>
        <Typography.Regular14>{t('total balance')}</Typography.Regular14>
        <IconButton
          style={styles.hideButton}
          icon={hideBalance ? 'hide' : 'show'}
          onPress={() => setHideBalance((hide) => !hide)}
        />
      </View>
      {loadingBalance || loadingFiatAmount ? (
        <TypographyContentLoaders.SemiBold30 width={200} />
      ) : (
        <Typography.SemiBold30>
          {hideBalance ? '••••' : `${formatFiatAmount(fiatAmount)} ${fiatSymbol}`}
        </Typography.SemiBold30>
      )}

      {/* Uset total tokens balance */}
      {loadingBalance || loadingTotalDelegated ? (
        <TypographyContentLoaders.Regular14 width={200} />
      ) : (
        <Typography.Regular14>
          {hideBalance ? '••••' : formatCoins(totalBalance)}
        </Typography.Regular14>
      )}

      <Spacer paddingVertical={24} />

      {/* User available tokens */}
      <AccountBalancesAction
        label={t('common:available')}
        loading={loadingBalance}
        value={hideBalance ? '••••' : formatCoins(balance)}
        buttonText={t('common:send')}
        buttonAccent
        onButtonPressed={onSendPressed}
      />

      <Spacer paddingVertical={8} />

      {/* User total staked amount */}
      <AccountBalancesAction
        label={t('staking:total staked')}
        loading={loadingTotalDelegated}
        value={hideBalance ? '••••' : formatCoins(totalDelegated)}
        buttonText={totalStakedButtonText}
        onButtonPressed={onTotalStakedButtonPressed}
      />

      {userHaveDelegations && (
        <>
          <Spacer paddingVertical={8} />

          {/* User pending staking rewards */}
          <AccountBalancesAction
            label={t('staking:total staking rewards')}
            loading={loadingStakingRewards}
            value={hideBalance ? '••••' : formatCoins(stakingRewards)}
            buttonText={t('common:claim')}
            buttonColor={'#1EC490'}
            onButtonPressed={onClaimAllRewards}
          />
        </>
      )}

      <Spacer paddingVertical={25} />
    </View>
  );
};

export default AccountBalances;
