import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
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
import { useEstimateFee, useSignAndBroadcastTx } from 'screens/BroadcastTx/hooks';
import { DPMImages } from 'types/images';
import { DeliverTxResponse } from '@desmoslabs/desmjs';
import useOnScreenDetached from 'hooks/useOnScreenDetached';
import { useSetHomeShouldReloadData } from '@recoil/home';
import { DPMImageProps } from 'components/DPMImage';
import useTrackScreen from 'hooks/analytics/useTrackScreen';
import { Screens } from 'types/analytics';
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
  customSuccessMessage?: string;
  customSuccessImage?: DPMImageProps['source'];
  customFailedMessage?: string;
  customFailedImage?: DPMImageProps['source'];
  onSuccess?: (tx: DeliverTxResponse) => any;
  onCancel?: () => any;
  onError?: () => any;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.BROADCAST_TX>;

/**
 * Screen that allows the user to broadcast a transaction.
 * @constructor
 */
const BroadcastTx: React.FC<NavProps> = (props) => {
  const { navigation, route } = props;
  const {
    messages,
    memo,
    customSuccessMessage,
    customSuccessImage,
    customFailedMessage,
    customFailedImage,
    onSuccess,
    onCancel,
    onError,
  } = route.params;
  const { t } = useTranslation('transaction');
  const styles = useStyles();

  useTrackScreen(Screens.BroadcastTransaction);

  // --------------------------------------------------------------------------------------
  // --- Hooks
  // --------------------------------------------------------------------------------------

  const broadcastTx = useSignAndBroadcastTx();
  const showModal = useShowModal();
  const { estimateFees, estimatingFee, areFeeApproximated, estimatedFee } = useEstimateFee();
  const setHomeShouldReloadData = useSetHomeShouldReloadData();

  // --------------------------------------------------------------------------------------
  // --- Local state
  // --------------------------------------------------------------------------------------

  const [broadcastingTx, setBroadcastingTx] = useState(false);
  const [broadcastTxStatus, setBroadcastTxStatus] = useState<BroadcastTxStatus>({
    status: BroadcastStatus.Cancel,
  });

  useEffect(() => {
    estimateFees(messages, memo);
  }, [estimateFees, memo, messages]);

  const buttonText = React.useMemo(() => {
    if (estimatingFee) {
      return t('computing fee');
    }
    if (broadcastingTx) {
      return t('broadcasting tx');
    }
    return t('common:confirm');
  }, [t, estimatingFee, broadcastingTx]);

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
  }, [broadcastTxStatus, onCancel, onError, onSuccess, setHomeShouldReloadData]);

  // --------------------------------------------------------------------------------------
  // --- Callbacks
  // --------------------------------------------------------------------------------------

  const showSuccessModal = React.useCallback(() => {
    showModal(SingleButtonModal, {
      image: customSuccessImage ?? DPMImages.TxSuccess,
      title: t('common:success'),
      message: customSuccessMessage ?? `${t('tx sent successfully')}!`,
      actionLabel: t('common:continue'),
      action: () => navigation.goBack(),
    });
  }, [showModal, customSuccessImage, t, customSuccessMessage, navigation]);

  const showErrorModal = React.useCallback(
    (error: string) => {
      showModal(SingleButtonModal, {
        image: customFailedImage ?? DPMImages.TxFailed,
        title: t('common:failure'),
        message: customFailedMessage ?? error,
        actionLabel: t('common:continue'),
        action: () => navigation.goBack(),
      });
    },
    [showModal, customFailedImage, t, customFailedMessage, navigation],
  );

  const confirmBroadcast = React.useCallback(async () => {
    if (estimatedFee !== undefined) {
      setBroadcastingTx(true);
      const broadcastResult = await broadcastTx(messages, estimatedFee, memo);
      setHomeShouldReloadData(true);
      if (broadcastResult.isOk()) {
        const deliveredTx = broadcastResult.value;
        if (deliveredTx !== undefined) {
          setBroadcastTxStatus({ status: BroadcastStatus.Success, deliveredTx });
          showSuccessModal();
        } else {
          setBroadcastTxStatus({ status: BroadcastStatus.Cancel });
        }
      } else {
        const errorMessage = broadcastResult.error.message;
        setBroadcastTxStatus({ status: BroadcastStatus.Fail, error: errorMessage });
        showErrorModal(errorMessage);
      }
      setBroadcastingTx(false);
    }
  }, [
    broadcastTx,
    estimatedFee,
    memo,
    messages,
    setHomeShouldReloadData,
    showErrorModal,
    showSuccessModal,
  ]);

  // --------------------------------------------------------------------------------------
  // --- Screen rendering
  // --------------------------------------------------------------------------------------

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} title={t('tx details')} />}>
      <TransactionDetails
        messages={messages}
        memo={memo}
        estimatingFee={estimatingFee}
        fee={estimatedFee}
        approximatedFee={areFeeApproximated}
      />
      <Button
        style={styles.nextBtn}
        mode="contained"
        onPress={confirmBroadcast}
        loading={broadcastingTx || estimatingFee}
        disabled={broadcastingTx || estimatingFee}
      >
        {buttonText}
      </Button>
    </StyledSafeAreaView>
  );
};

export default BroadcastTx;
