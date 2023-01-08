import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SingleButtonModal from 'modals/SingleButtonModal';
import TransactionDetails from 'components/TransactionDetails';
import useShowModal from 'hooks/useShowModal';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { EncodeObject } from '@cosmjs/proto-signing';
import { useBroadcastTx } from 'screens/BroadcastTx/useHooks';
import { DPMImages } from 'types/images';
import { DeliverTxResponse } from '@desmoslabs/desmjs';
import useOnScreenDetached from 'hooks/useOnScreenDetached';
import useStyles from './useStyles';

enum BroadcastStatus {
  Cancel,
  Success,
  Fail,
}

interface CancelledBroadcastTx {
  readonly status: BroadcastStatus.Cancel;
}

interface SuccessBroadcastTx {
  readonly status: BroadcastStatus.Success;
  readonly deliveredTx: DeliverTxResponse;
}

interface FailedBroadcastTx {
  readonly status: BroadcastStatus.Fail;
  readonly error: string;
}

type BroadcastTxStatus = CancelledBroadcastTx | SuccessBroadcastTx | FailedBroadcastTx;

export interface BroadcastTxParams {
  messages: EncodeObject[];
  memo?: string;
  onSuccess?: (tx: DeliverTxResponse) => any;
  onCancel?: () => any;
  onError?: () => any;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.BROADCAST_TX>;

const BroadcastTx: React.FC<NavProps> = (props) => {
  const { navigation, route } = props;
  const { messages, memo, onSuccess, onCancel, onError } = route.params;
  const { t } = useTranslation();
  const styles = useStyles();
  const broadcastTx = useBroadcastTx();
  const showModal = useShowModal();
  const [broadcastingTx, setBroadcastingTx] = useState(false);
  const [broadcastTxStatus, setBroadcastTxStatus] = useState<BroadcastTxStatus>({
    status: BroadcastStatus.Cancel,
  });

  useOnScreenDetached(() => {
    switch (broadcastTxStatus.status) {
      case BroadcastStatus.Success:
        if (onSuccess) {
          onSuccess(broadcastTxStatus.deliveredTx);
        }
        break;
      case BroadcastStatus.Cancel:
        if (onCancel) {
          onCancel();
        }
        break;
      default:
        if (onError) {
          onError();
        }
        break;
    }
  }, [broadcastTxStatus, onCancel, onError, onSuccess]);

  const showSuccessModal = useCallback(() => {
    showModal(SingleButtonModal, {
      image: DPMImages.Success,
      title: t('success'),
      message: `${t('tx sent successfully')}!`,
      actionLabel: t('continue'),
      action: () => navigation.goBack(),
    });
  }, [showModal, t, navigation]);

  const showErrorModal = useCallback(
    (error: string) => {
      showModal(SingleButtonModal, {
        image: DPMImages.Fail,
        title: t('failure'),
        message: error,
        actionLabel: t('continue'),
        action: () => navigation.goBack(),
      });
    },
    [showModal, t, navigation],
  );

  const confirmBroadcast = useCallback(async () => {
    setBroadcastingTx(true);
    try {
      const result = await broadcastTx(messages, memo);
      if (result !== undefined) {
        setBroadcastTxStatus({ status: BroadcastStatus.Success, deliveredTx: result });
        showSuccessModal();
      } else {
        setBroadcastTxStatus({ status: BroadcastStatus.Cancel });
      }
    } catch (e) {
      setBroadcastTxStatus({ status: BroadcastStatus.Fail, error: e.message });
      showErrorModal(e.message);
    }
    setBroadcastingTx(false);
  }, [broadcastTx, memo, messages, showErrorModal, showSuccessModal]);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} title={t('tx details')} />}>
      <TransactionDetails messages={messages} memo={memo} />
      <Button
        style={styles.nextBtn}
        mode="contained"
        onPress={confirmBroadcast}
        loading={broadcastingTx}
        disabled={broadcastingTx}
      >
        {!broadcastingTx ? t('confirm') : t('broadcasting tx')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default BroadcastTx;
