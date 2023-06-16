import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import React from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';
import { coin } from '@cosmjs/amino';
import { Transaction } from 'types/transactions';
import ROUTES from 'navigation/routes';
import {
  AllowedMsgAllowanceTypeUrl,
  BasicAllowanceTypeUrl,
  GenericAuthorizationTypeUrl,
  MsgEditPostTypeUrl,
  MsgFundCommunityPoolTypeUrl,
  MsgGrantAllowanceTypeUrl,
  MsgGrantTypeUrl,
  MsgMultiSendTypeUrl,
  MsgRevokeAllowanceTypeUrl,
  MsgRevokeTypeUrl,
  MsgSendTypeUrl,
  MsgSetWithdrawAddressTypeUrl,
  MsgWithdrawDelegatorRewardTypeUrl,
  MsgWithdrawValidatorCommissionTypeUrl,
  PeriodicAllowanceTypeUrl,
} from '@desmoslabs/desmjs';
import { MsgExec, MsgGrant, MsgRevoke } from 'cosmjs-types/cosmos/authz/v1beta1/tx';
import { GenericAuthorization, Grant } from 'cosmjs-types/cosmos/authz/v1beta1/authz';
import { MsgExecTypeUrl } from 'types/cosmos';
import { MsgMultiSend, MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import {
  MsgFundCommunityPool,
  MsgSetWithdrawAddress,
  MsgWithdrawDelegatorReward,
  MsgWithdrawValidatorCommission,
} from 'cosmjs-types/cosmos/distribution/v1beta1/tx';
import { MsgGrantAllowance, MsgRevokeAllowance } from 'cosmjs-types/cosmos/feegrant/v1beta1/tx';
import {
  AllowedMsgAllowance,
  BasicAllowance,
  PeriodicAllowance,
} from 'cosmjs-types/cosmos/feegrant/v1beta1/feegrant';

const TEST_ADDRESS1 = 'desmos1nm6kh6jwqmsezwtnmgdd4w4tzyk9f8gvqu5en0';
const TEST_ADDRESS2 = 'desmos1jvw63nnapa899l753dh4znw5u6kc9zycpc043v';

const useShowTestTransaction = () => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  return React.useCallback(() => {
    const messages: EncodeObject[] = [
      // Authz Module
      {
        typeUrl: MsgGrantTypeUrl,
        value: MsgGrant.fromPartial({
          grantee: TEST_ADDRESS1,
          granter: TEST_ADDRESS2,
          grant: Grant.fromPartial({
            expiration: {
              seconds: '100000',
            },
            authorization: {
              typeUrl: GenericAuthorizationTypeUrl,
              value: GenericAuthorization.encode(
                GenericAuthorization.fromPartial({
                  msg: MsgEditPostTypeUrl,
                }),
              ).finish(),
            },
          }),
        }),
      },
      {
        typeUrl: MsgExecTypeUrl,
        value: MsgExec.fromPartial({
          grantee: 'desmos1grantee',
          msgs: [
            {
              typeUrl: MsgSendTypeUrl,
              value: MsgSend.encode(
                MsgSend.fromPartial({
                  fromAddress: TEST_ADDRESS1,
                  toAddress: TEST_ADDRESS2,
                  amount: [coin('0', 'udaric')],
                }),
              ).finish(),
            },
          ],
        }),
      },
      {
        typeUrl: MsgRevokeTypeUrl,
        value: MsgRevoke.fromPartial({
          granter: TEST_ADDRESS2,
          grantee: TEST_ADDRESS1,
          msgTypeUrl: MsgSendTypeUrl,
        }),
      },

      // Bank module
      {
        typeUrl: MsgSendTypeUrl,
        value: MsgSend.fromPartial({
          fromAddress: TEST_ADDRESS1,
          toAddress: TEST_ADDRESS2,
          amount: [coin('10000', 'udaric')],
        }),
      },
      {
        typeUrl: MsgMultiSendTypeUrl,
        value: MsgMultiSend.fromPartial({
          inputs: [
            {
              address: TEST_ADDRESS1,
              coins: [coin('0', 'udaric')],
            },
          ],
          outputs: [
            {
              address: TEST_ADDRESS2,
              coins: [coin('10', 'udaric')],
            },
            {
              address: TEST_ADDRESS2,
              coins: [coin('11', 'udaric')],
            },
          ],
        }),
      },
      // Distribution module
      {
        typeUrl: MsgWithdrawDelegatorRewardTypeUrl,
        value: MsgWithdrawDelegatorReward.fromPartial({
          validatorAddress: 'desmos1validator',
          delegatorAddress: 'desmos1delegator',
        }),
      },
      {
        typeUrl: MsgSetWithdrawAddressTypeUrl,
        value: MsgSetWithdrawAddress.fromPartial({
          delegatorAddress: 'desmos1delegator',
          withdrawAddress: 'desmos1newaddress',
        }),
      },
      {
        typeUrl: MsgWithdrawValidatorCommissionTypeUrl,
        value: MsgWithdrawValidatorCommission.fromPartial({
          validatorAddress: 'desmos1validator',
        }),
      },
      {
        typeUrl: MsgFundCommunityPoolTypeUrl,
        value: MsgFundCommunityPool.fromPartial({
          amount: [coin('10000000', 'udaric')],
          depositor: 'desmos1depositor',
        }),
      },

      // Fee grant module
      {
        typeUrl: MsgGrantAllowanceTypeUrl,
        value: MsgGrantAllowance.fromPartial({
          granter: 'desmos1granter',
          grantee: 'desmos1grantee',
          allowance: {
            typeUrl: BasicAllowanceTypeUrl,
            value: BasicAllowance.encode(
              BasicAllowance.fromPartial({
                expiration: {
                  seconds: 200000,
                },
                spendLimit: [coin(2000, 'udaric')],
              }),
            ).finish(),
          },
        }),
      },
      {
        typeUrl: MsgGrantAllowanceTypeUrl,
        value: MsgGrantAllowance.fromPartial({
          granter: 'desmos1granter',
          grantee: 'desmos1grantee',
          allowance: {
            typeUrl: PeriodicAllowanceTypeUrl,
            value: PeriodicAllowance.encode(
              PeriodicAllowance.fromPartial({
                basic: {
                  spendLimit: [coin(200000, 'udaric')],
                  expiration: {
                    seconds: 2000000,
                  },
                },
                period: {
                  seconds: 1000000,
                },
                periodReset: {
                  seconds: 5000000,
                },
                periodCanSpend: [coin(20000, 'udaric')],
                periodSpendLimit: [coin(1000, 'udaric')],
              }),
            ).finish(),
          },
        }),
      },
      {
        typeUrl: MsgGrantAllowanceTypeUrl,
        value: MsgGrantAllowance.fromPartial({
          granter: 'desmos1granter',
          grantee: 'desmos1grantee',
          allowance: {
            typeUrl: AllowedMsgAllowanceTypeUrl,
            value: AllowedMsgAllowance.encode(
              AllowedMsgAllowance.fromPartial({
                allowance: {
                  typeUrl: BasicAllowanceTypeUrl,
                  value: BasicAllowance.encode(
                    BasicAllowance.fromPartial({
                      expiration: {
                        seconds: 200000,
                      },
                      spendLimit: [coin(2000, 'udaric')],
                    }),
                  ).finish(),
                },
                allowedMessages: [MsgSendTypeUrl, MsgSendTypeUrl, MsgSendTypeUrl],
              }),
            ).finish(),
          },
        }),
      },
      {
        typeUrl: MsgRevokeAllowanceTypeUrl,
        value: MsgRevokeAllowance.fromPartial({
          granter: 'desmos1granter',
          grantee: 'desmos1grantee',
        }),
      },
    ];

    const transaction: Transaction = {
      hash: 'tx-hash',
      success: true,
      fee: {
        amount: [coin('10000000', 'udaric')],
        gas: '2000000',
      },
      timestamp: new Date().toString(),
      memo: 'this is a test transaction to showcase all messages',
      messages,
    };

    navigation.navigate(ROUTES.TRANSACTION_DETAILS, {
      transaction,
    });
  }, [navigation]);
};

export default useShowTestTransaction;
