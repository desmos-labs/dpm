import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import React from 'react';
import ROUTES from 'navigation/routes';
import useShowModal from 'hooks/useShowModal';
import SingleButtonModal from 'modals/SingleButtonModal';
import { DPMImages } from 'types/images';
import { useTranslation } from 'react-i18next';

/**
 * Hook that provides a function to initiate the restake flow that let
 * the user select a validator and then select the amount of tokens to
 * redelegate from the provided validator address to the selected one.
 */
export const useRestake = (fromValidator: string) => {
  const navigation = useNavigation<NavigationProp<RootNavigatorParamList>>();
  const showModal = useShowModal();
  const { t } = useTranslation();

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
          });
        }
      },
    });
  }, [navigation, fromValidator]);
};
