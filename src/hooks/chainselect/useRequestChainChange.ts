import { useCurrentChainType, useSetSetting } from '@recoil/settings';
import React from 'react';
import useShowModal from 'hooks/useShowModal';
import { ChainType } from 'types/chains';
import TwoButtonModal from 'modals/TwoButtonModal';
import { useTranslation } from 'react-i18next';
import { DesmosMainnet, DesmosTestnet } from '@desmoslabs/desmjs';

export type ChangeChainParams = {
  /**
   * The message that will be displayed to the user.
   */
  message: string;
  /**
   * The new chain that you want to switch to.
   */
  newChainType: ChainType;
  /**
   * Callback that will be called when the user confirms the action
   * or if the user is already on the right chain.
   */
  onSuccess: () => any;
  /**
   * Callback that will be called when the user cancels the action.
   */
  onCancel?: () => any;
};

/**
 * Hooke that provides a function that will request to the user if
 * wants to change the current chain.
 * If the chain that you want to switch to is the current selected one,
 * the function will don't prompt anything to the user.
 */
const useRequestChainChange = () => {
  const { t } = useTranslation('common');
  const setChainName = useSetSetting('chainName');
  const showModal = useShowModal();
  const currentChainType = useCurrentChainType();

  const changeNetwork = React.useCallback(
    (chainType: ChainType) => {
      setChainName(
        chainType === ChainType.Mainnet ? DesmosMainnet.chainName : DesmosTestnet.chainName,
      );
    },
    [setChainName],
  );

  return React.useCallback(
    ({ message, newChainType, onSuccess, onCancel }: ChangeChainParams) => {
      if (currentChainType === newChainType) {
        // Shortcut to onSuccess since we are already on the right chain.
        changeNetwork(newChainType);
        onSuccess();
      } else {
        showModal(TwoButtonModal, {
          title: t('change network'),
          message,
          positiveActionLabel: t('ok'),
          positiveAction: () => {
            changeNetwork(newChainType);
            onSuccess();
          },
          negativeActionLabel: t('cancel'),
          negativeAction: onCancel,
        });
      }
    },
    [changeNetwork, currentChainType, showModal, t],
  );
};

export default useRequestChainChange;
