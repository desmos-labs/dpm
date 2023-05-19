import { EncodeObject } from '@cosmjs/proto-signing';
import { format } from 'date-fns';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import { StdFee } from '@cosmjs/amino';
import Divider from 'components/Divider';
import LabeledValue from 'components/LabeledValue';
import { formatCoins } from 'lib/FormatUtils';
import { Fee } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import MessageDetails from 'components/Messages/MessageDetails';
import useStyles from './useStyles';

export type TransactionDetailsProps = {
  /**
   * Messages to be displayed to the user.
   */
  messages: readonly EncodeObject[];
  /**
   * True if the fees are still being estimaded.
   */
  estimatingFee?: boolean;
  /**
   * Fees to be shown to the user.
   */
  fee?: StdFee | Fee;
  /**
   * Memo associated with the transaction.
   */
  memo?: string;
  /**
   * Whether the transaction was broadcast successfully or not.
   */
  success?: boolean;
  /**
   * Date at which the transaction was broadcast.
   */
  dateTime?: Date;
  style?: StyleProp<ViewStyle>;
};

const TransactionDetails: React.FC<TransactionDetailsProps> = (props) => {
  const { t } = useTranslation('transaction');
  const styles = useStyles();

  const { memo, messages, fee, success, dateTime, style, estimatingFee } = props;

  const txFex = useMemo(() => formatCoins(fee?.amount), [fee]);

  return (
    <View style={styles.root}>
      <ScrollView style={style}>
        <Pressable>
          {messages.map((msg: EncodeObject, i: number) => (
            <View key={`view_${i * 2}`}>
              <MessageDetails key={`msg_${i * 2}`} message={msg} />
              <Divider key={`divider_${i * 2}`} />
            </View>
          ))}
          <LabeledValue label={t('fee')} value={txFex} loading={estimatingFee} />
          <Divider />
          {dateTime && (
            <>
              <LabeledValue label={t('time')} value={format(dateTime, 'dd MMM yyyy, HH:mm:ss')} />
              <Divider />
            </>
          )}
          {success !== undefined && (
            <>
              <LabeledValue
                label={t('status')}
                value={success ? t('common:success') : t('common:fail')}
              />
              <Divider />
            </>
          )}
          <LabeledValue label={t('memo')} value={(memo?.length ?? 0) > 0 ? memo : ''} />
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default TransactionDetails;
