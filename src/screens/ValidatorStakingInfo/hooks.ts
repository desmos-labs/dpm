import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import React from 'react';
import ROUTES from 'navigation/routes';
import useShowModal from 'hooks/useShowModal';
import SingleButtonModal from 'modals/SingleButtonModal';
import { DPMImages } from 'types/images';
import { useTranslation } from 'react-i18next';
import useBroadcastTx from 'hooks/useBroadcastTx';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import { MsgWithdrawDelegatorRewardTypeUrl } from '@desmoslabs/desmjs';
import { MsgWithdrawDelegatorRewardEncodeObject } from '@cosmjs/stargate';
import useReturnToCurrentScreen from 'hooks/useReturnToCurrentScreen';
import { Validator } from 'types/validator';

/**
 * Hook that provides a function to claim the pending staking rewards
 * from a validator.
 */
export const useClaimPendingRewards = (fromValidator: string) => {
  const { t } = useTranslation('staking');
  const activeAccountAddress = useActiveAccountAddress()!;
  const broadcastTx = useBroadcastTx();
  const returnToCurrentScreen = useReturnToCurrentScreen();

  return React.useCallback(
    (onSuccess?: () => any) => {
      broadcastTx(
        [
          {
            typeUrl: MsgWithdrawDelegatorRewardTypeUrl,
            value: {
              validatorAddress: fromValidator,
              delegatorAddress: activeAccountAddress,
            },
          } as MsgWithdrawDelegatorRewardEncodeObject,
        ],
        {
          onSuccess: () => {
            returnToCurrentScreen();
            if (onSuccess) {
              onSuccess();
            }
          },
          customSuccessMessage: t('rewards claimed successfully'),
          customFailedMessage: t('rewards claimed unsuccessfully'),
        },
      );
    },
    [activeAccountAddress, broadcastTx, fromValidator, returnToCurrentScreen, t],
  );
};

/**
 * Hook that provides a function to stake some coins torward a validator.
 */
export const useStakeCoins = () => {
  const navigation = useNavigation<NavigationProp<RootNavigatorParamList>>();
  const returnToCurrentScreen = useReturnToCurrentScreen();

  return React.useCallback(
    (validator: Validator, onSuccess?: () => any) => {
      navigation.navigate(ROUTES.STAKE, {
        validator,
        onSuccess: () => {
          returnToCurrentScreen();
          if (onSuccess) {
            onSuccess();
          }
        },
      });
    },
    [navigation, returnToCurrentScreen],
  );
};

/**
 * Hook that provides a function to initiate the restake flow that lets
 * the user select a validator and then select the amount of tokens to
 * redelegate from the provided validator address to the selected one.
 */
export const useRestake = (fromValidator: string, onSuccess?: () => any) => {
  const navigation = useNavigation<NavigationProp<RootNavigatorParamList>>();
  const showModal = useShowModal();
  const { t } = useTranslation();
  const returnToCurrentScreen = useReturnToCurrentScreen();

  return React.useCallback(() => {
    navigation.navigate(ROUTES.SELECT_VALIDATOR, {
      onValidatorSelected: (validator) => {
        if (validator.operatorAddress === fromValidator) {
          showModal(SingleButtonModal, {
            title: t('common:error'),
            message: t(
              "selectValidator:can't select this validator, you are redelegating from this one",
            ),
            image: DPMImages.Fail,
            actionLabel: t('common:hide'),
          });
        } else {
          navigation.navigate(ROUTES.REDELEGATE, {
            fromValidatorAddress: fromValidator,
            toValidatorAddress: validator.operatorAddress,
            onSuccess: () => {
              returnToCurrentScreen();
              if (onSuccess) {
                onSuccess();
              }
            },
          });
        }
      },
    });
  }, [navigation, fromValidator, showModal, t, returnToCurrentScreen, onSuccess]);
};

/**
 * Hook that provides a function to initiate the unbond tokens flow that let
 * the user select the amount of tokens to unbond from a validator.
 */
export const useUnbondTokens = (fromValidator: string) => {
  const navigation = useNavigation<NavigationProp<RootNavigatorParamList>>();
  const returnToCurrentScreen = useReturnToCurrentScreen();

  return React.useCallback(
    (onSuccess?: () => any) => {
      navigation.navigate(ROUTES.UNBOND_TOKENS, {
        fromValidator,
        onSuccess: () => {
          returnToCurrentScreen();
          if (onSuccess) {
            onSuccess();
          }
        },
      });
    },
    [navigation, fromValidator, returnToCurrentScreen],
  );
};
