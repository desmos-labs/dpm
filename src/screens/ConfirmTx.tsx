import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, StyledSafeAreaView, TopBar } from '../components';
import { TransactionDetails } from '../components/Transaction/TransactionDetails';
import useBroadcastMessages from '../hooks/useBroadcastMessages';
import useNavigateToHomeScreen from '../hooks/useNavigateToHomeScreen';
import useSelectedAccount from '../hooks/useSelectedAccount';
import useShowModal from '../hooks/useShowModal';
import useUnlockWallet from '../hooks/useUnlockWallet';
import { SingleButtonModal } from '../modals/SingleButtonModal';
import { makeStyle } from '../theming';
import { AccountScreensStackParams } from '../types/navigation';

export type Props = StackScreenProps<AccountScreensStackParams, 'ConfirmTx'>;

export const ConfirmTx: React.FC<Props> = (props) => {
  const { navigation, route } = props;
  const { messages, memo, fee, feeGranter, backAction, successAction } = route.params;
  const { t } = useTranslation();
  const styles = useStyles();
  const currentAccount = useSelectedAccount();
  const broadcastMessages = useBroadcastMessages();
  const unlockWallet = useUnlockWallet();
  const showModal = useShowModal();
  const [broadcastingTx, setBroadcastingTx] = useState(false);
  const navigateToHomeScreen = useNavigateToHomeScreen();

  const showSuccessModal = useCallback(() => {
    const modalAction = () => {
      if (backAction === undefined) {
        navigateToHomeScreen({ reset: true });
      } else {
        navigation.dispatch(backAction);
      }
    };
    showModal(SingleButtonModal, {
      image: 'success',
      title: t('success'),
      message: `${t('tx sent successfully')}!`,
      actionLabel: backAction === undefined ? t('go to profile') : t('continue'),
      action: modalAction,
    });
  }, [showModal, t, backAction, navigateToHomeScreen, navigation]);

  const showErrorModal = useCallback(
    (error: string) => {
      showModal(SingleButtonModal, {
        image: 'fail',
        title: t('failure'),
        message: error,
        actionLabel: t('ok'),
      });
    },
    [showModal, t]
  );

  const broadcastTx = useCallback(async () => {
    setBroadcastingTx(true);
    const wallet = await unlockWallet(currentAccount);
    if (wallet !== null) {
      try {
        await broadcastMessages(wallet, messages, fee, memo);
        if (successAction !== undefined) {
          successAction();
        }
        showSuccessModal();
      } catch (e) {
        showErrorModal(e.toString());
      }
    }
    setBroadcastingTx(false);
  }, [
    broadcastMessages,
    currentAccount,
    fee,
    memo,
    messages,
    showErrorModal,
    showSuccessModal,
    successAction,
    unlockWallet,
  ]);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} title={t('tx details')} />}>
      <TransactionDetails messages={messages} memo={memo} fee={fee} />
      <Button
        style={styles.nextBtn}
        mode="contained"
        onPress={broadcastTx}
        loading={broadcastingTx}
        disabled={broadcastingTx}
      >
        {!broadcastingTx ? t('confirm') : t('broadcasting tx')}
      </Button>
    </StyledSafeAreaView>
  );
};

const useStyles = makeStyle((theme) => ({
  nextBtn: {
    marginTop: theme.spacing.m,
  },
}));
