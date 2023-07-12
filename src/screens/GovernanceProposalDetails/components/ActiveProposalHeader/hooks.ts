import useShowModal from 'hooks/useShowModal';
import { Proposal } from 'types/proposals';
import React from 'react';
import GovernanceVoteModal from 'modals/GovernanceVoteModal';
import useBroadcastTx, { BroadcastTxCallbacks } from 'hooks/useBroadcastTx';
import { useTranslation } from 'react-i18next';
import AmountAndMemoModal from 'modals/AmountAndMemoModal';
import { AmountLimit } from 'components/CoinAmountInput/limits';
import { ModalMode } from 'modals/ModalScreen';
import { Gov } from '@desmoslabs/desmjs';
import { MsgDeposit, MsgVote } from '@desmoslabs/desmjs-types/cosmos/gov/v1/tx';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import GovernanceTransactionModal from 'modals/GovernanceTransactionModal';

/**
 * Hook that provides a function to vote on a proposal.
 * @param proposal - The proposal to which you want to vote.
 * @param broadcastTxCallbacks - Broadcast tx callbacks.
 */
export const useVoteProposal = (
  proposal: Proposal,
  broadcastTxCallbacks?: BroadcastTxCallbacks,
) => {
  const { t } = useTranslation('governance');
  const activeAccountAddress = useActiveAccountAddress()!;
  const showModal = useShowModal();
  const broadcastTx = useBroadcastTx();

  return React.useCallback(() => {
    showModal(
      GovernanceVoteModal,
      {
        onSelect: (voteOption) => {
          showModal(
            GovernanceTransactionModal,
            {
              proposal,
              voteOption,
              onNextPressed: (p, option, memo) => {
                broadcastTx(
                  [
                    {
                      typeUrl: Gov.v1.MsgVoteTypeUrl,
                      value: MsgVote.fromPartial({
                        proposalId: p.id,
                        voter: activeAccountAddress,
                        option,
                      }),
                    } as Gov.v1.MsgVoteEncodeObject,
                  ],
                  {
                    memo,
                    customSuccessMessage: t('proposal vote succeed', { proposalId: proposal.id }),
                    ...broadcastTxCallbacks,
                  },
                );
              },
            },
            {
              mode: ModalMode.BottomSheet,
            },
          );
        },
      },
      {
        mode: ModalMode.BottomSheet,
      },
    );
  }, [showModal, proposal, broadcastTx, activeAccountAddress, t, broadcastTxCallbacks]);
};

/**
 * Hook that provides a function to deposit on a proposal.
 * @param proposal - The proposal to which you want to deposit.
 * @param broadcastTxCallbacks - Broadcast tx callbacks.
 */
export const useDepositOnProposal = (
  proposal: Proposal,
  broadcastTxCallbacks?: BroadcastTxCallbacks,
) => {
  const activeAccountAddress = useActiveAccountAddress()!;
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
          broadcastTx(
            [
              {
                typeUrl: Gov.v1.MsgDepositTypeUrl,
                value: MsgDeposit.fromPartial({
                  proposalId: proposal.id,
                  amount: [amount],
                  depositor: activeAccountAddress,
                }),
              } as Gov.v1.MsgDepositEncodeObject,
            ],
            {
              memo,
              customSuccessMessage: t('proposal deposit succeed', { proposalId: proposal.id }),
              ...broadcastTxCallbacks,
            },
          );
        },
      },
      {
        mode: ModalMode.BottomSheet,
      },
    );
  }, [showModal, broadcastTx, t, proposal.id, broadcastTxCallbacks, activeAccountAddress]);
};
