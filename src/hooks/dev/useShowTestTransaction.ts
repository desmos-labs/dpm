import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import React from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';
import { coin } from '@cosmjs/amino';
import { Transaction } from 'types/transactions';
import ROUTES from 'navigation/routes';
import {
  GenericAuthorizationTypeUrl,
  MsgEditPostTypeUrl,
  MsgGrantTypeUrl,
  MsgRevokeTypeUrl,
  MsgSendTypeUrl,
} from '@desmoslabs/desmjs';
import { MsgExec, MsgGrant, MsgRevoke } from 'cosmjs-types/cosmos/authz/v1beta1/tx';
import { GenericAuthorization, Grant } from 'cosmjs-types/cosmos/authz/v1beta1/authz';
import { MsgExecTypeUrl } from 'types/cosmos';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';

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
