import useShowModal from 'hooks/useShowModal';
import { Proposal } from 'types/proposals';
import React from 'react';
import GovernanceVoteModal from 'modals/GovernanceVoteModal';
import useBroadcastTx, { BroadcastTxCallbacks } from 'hooks/useBroadcastTx';
import { useTranslation } from 'react-i18next';
import AmountAndMemoModal from 'modals/AmountAndMemoModal';
import { AmountLimit } from 'components/CoinAmountInput/limits';
import { ModalMode } from 'modals/ModalScreen';

export const useVoteProposal = (
  proposal: Proposal,
  broadcastTxCallbacks?: BroadcastTxCallbacks,
) => {
  const { t } = useTranslation('governance');
  const showModal = useShowModal();
  const broadcastTx = useBroadcastTx();

  return React.useCallback(() => {
    showModal(
      GovernanceVoteModal,
      {
        onSelect: (option) => {
          // TODO: Create the vote message.
          broadcastTx([], {
            customSuccessMessage: t('proposal vote succeed', { proposalId: proposal.id }),
            customFailedMessage: t('proposal vote failed', { proposalId: proposal.id }),
            ...broadcastTxCallbacks,
          });
        },
      },
      {
        mode: ModalMode.BottomSheet,
      },
    );
  }, [showModal, broadcastTx, t, proposal.id, broadcastTxCallbacks]);
};

export const useDepositOnProposal = (
  proposal: Proposal,
  broadcastTxCallbacks?: BroadcastTxCallbacks,
) => {
  const { t } = useTranslation('governance');
  const showModal = useShowModal();
  const broadcastTx = useBroadcastTx();

  return React.useCallback(() => {
    showModal(
      AmountAndMemoModal,
      {
        title: t('deposit'),
        amountLimitConfig: {
          mode: AmountLimit.UserBalance,
        },
        onSelect: (amount, memo) => {
          // TODO: Create the deposit message.
          broadcastTx([], {
            memo,
            customSuccessMessage: t('proposal deposit succeed', { proposalId: proposal.id }),
            customFailedMessage: t('proposal deposit failed', { proposalId: proposal.id }),
            ...broadcastTxCallbacks,
          });
        },
      },
      {
        mode: ModalMode.BottomSheet,
      },
    );
  }, [showModal, broadcastTx, t, proposal.id, broadcastTxCallbacks]);
};
