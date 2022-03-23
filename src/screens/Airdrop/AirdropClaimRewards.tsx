import React, { useCallback, useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { CommonActions, CompositeScreenProps } from '@react-navigation/native';
import { AccountScreensStackParams, AirdropScreensStackParams } from '../../types/navigation';
import { Button, StyledSafeAreaView, TopBar, Typography } from '../../components';
import { FlexPadding } from '../../components/FlexPadding';
import { makeStyle } from '../../theming';
import useSelectedAccount from '../../hooks/useSelectedAccount';
import { AirdropApi } from '../../api/AirdropApi';
import useCheckPendingRewards from '../../hooks/useCheckPendingRewards';
import useShowModal from '../../hooks/useShowModal';
import { SingleButtonModal } from '../../modals/SingleButtonModal';

type Props = CompositeScreenProps<
  StackScreenProps<AirdropScreensStackParams, 'AirdropClaimRewards'>,
  StackScreenProps<AccountScreensStackParams>
>;

export const AirdropClaimRewards: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { params } = route;
  const styles = useStyles();
  const account = useSelectedAccount();
  const [claimingRewards, setClaimingRewards] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pendingRewards = useCheckPendingRewards(account.address);
  const showModal = useShowModal();

  useEffect(
    () => navigation.addListener('focus', pendingRewards.updatePendingRewards),
    [navigation, pendingRewards.updatePendingRewards]
  );

  const showSuccessModal = useCallback(() => {
    showModal(SingleButtonModal, {
      image: 'success',
      title: t('congratulations'),
      message: t('claimed amount', {
        amount: `${pendingRewards.toBeClaimed} DSM`,
      }),
      actionLabel: t('claim more'),
      action: () => navigation.goBack(),
    });
  }, [navigation, pendingRewards.toBeClaimed, showModal, t]);

  const showErrorModal = useCallback(
    (error: string) => {
      showModal(SingleButtonModal, {
        image: 'fail',
        title: t('fail'),
        message: error,
        actionLabel: t('try again'),
        action: () => setError(null),
      });
    },
    [showModal, t]
  );

  const claimRewards = useCallback(async () => {
    setClaimingRewards(true);
    setError(null);
    try {
      await AirdropApi.claimAirdrop(account.address);
      showSuccessModal();
    } catch (e) {
      setError(e.toString());
      showErrorModal(e.toString());
    }
    setClaimingRewards(false);
  }, [account.address, showErrorModal, showSuccessModal]);

  const connectMoreAccounts = useCallback(() => {
    navigation.pop(1);
    navigation.navigate({
      name: 'ChainLinkScreens',
      params: {
        screen: 'ConnectChain',
        params: {
          backAction: CommonActions.navigate({
            name: 'AirdropClaimRewards',
            params: {
              address: params.address,
            },
          }),
        },
      },
    });
  }, [navigation, params.address]);

  return (
    <StyledSafeAreaView
      topBar={
        <TopBar stackProps={{ navigation }} title={t('claim airdrop')} capitalizeTitle={false} />
      }
    >
      <Typography.Body1>{t('claimable amount')}</Typography.Body1>

      <Typography.H2 style={styles.amount}>
        {pendingRewards.loading
          ? '...'
          : pendingRewards.available
          ? `${pendingRewards.toBeClaimed} DSM`
          : '0 DSM'}
      </Typography.H2>

      <FlexPadding flex={1} />
      <Button
        mode="contained"
        onPress={claimRewards}
        loading={claimingRewards}
        disabled={claimingRewards || error !== null || !pendingRewards.available}
      >
        {t('claim now')}
      </Button>
      <Button style={styles.connectMore} mode="outlined" onPress={connectMoreAccounts}>
        {t('connect more accounts')}
      </Button>
    </StyledSafeAreaView>
  );
};

const useStyles = makeStyle((theme) => ({
  amount: {
    alignSelf: 'center',
  },
  connectMore: {
    marginTop: theme.spacing.l,
  },
}));
