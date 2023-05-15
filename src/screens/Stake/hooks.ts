import useBroadcastTx from 'hooks/useBroadcastTx';
import React from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { MsgDelegateTypeUrl } from '@desmoslabs/desmjs';
import { MsgDelegateEncodeObject } from '@cosmjs/stargate';
import ROUTES from 'navigation/routes';
import { Coin } from '@desmoslabs/desmjs-types/cosmos/base/v1beta1/coin';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import { useTranslation } from 'react-i18next';

export const useDelegateTokens = () => {
  const { t } = useTranslation('stake');
  const broadcastTx = useBroadcastTx();
  const navigation = useNavigation<NavigationProp<RootNavigatorParamList>>();
  const currentAccountAddress = useActiveAccountAddress();

  return React.useCallback(
    (amount: Coin, validatorOperatorAddress: string, memo?: string) => {
      broadcastTx(
        [
          {
            typeUrl: MsgDelegateTypeUrl,
            value: {
              amount,
              validatorAddress: validatorOperatorAddress,
              delegatorAddress: currentAccountAddress,
            },
          } as MsgDelegateEncodeObject,
        ],
        {
          memo,
          customSuccessMessage: t('your DSM has been staked'),
          customFailedMessage: t("your DSM hasn't been staked"),
          onSuccess: () =>
            navigation.reset({
              index: 0,
              routes: [{ name: ROUTES.HOME_TABS }],
            }),
        },
      );
    },
    [broadcastTx, currentAccountAddress, t, navigation],
  );
};
