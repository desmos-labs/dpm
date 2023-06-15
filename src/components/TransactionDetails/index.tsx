import { EncodeObject } from '@cosmjs/proto-signing';
import React, { useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { StdFee } from '@cosmjs/amino';
import { formatCoins } from 'lib/FormatUtils';
import { Fee } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import MessageDetails from 'components/Messages/MessageDetails';
import { FlashList } from '@shopify/flash-list';
import { ListRenderItem } from '@shopify/flash-list/src/FlashListProps';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import useStyles from './useStyles';
import TransactionInformation from './components/TransactionInformation';

export type TransactionDetailsProps = {
  /**
   * Optional transaction hash to display.
   */
  hash?: string;
  /**
   * Messages to be displayed to the user.
   */
  messages: readonly EncodeObject[];
  /**
   * True if the fees are still being estimated.
   */
  estimatingFee?: boolean;
  /**
   * Fees to be shown to the user.
   */
  fee?: StdFee | Fee;
  /**
   * Tells if the fee have been approximated.
   * If this field is true, the user will see a `~`
   * before the fee amount to easily understand that the
   * fees have been approximated.
   */
  approximatedFee?: boolean;
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
  const { messages, hash, memo, fee, success, dateTime, estimatingFee, approximatedFee } = props;

  const txFex = useMemo(() => {
    const formattedCoins = formatCoins(fee?.amount);
    return approximatedFee ? `~${formattedCoins}` : formattedCoins;
  }, [approximatedFee, fee?.amount]);

  const renderMessages = React.useCallback<ListRenderItem<EncodeObject>>(
    ({ item }) => <MessageDetails message={item} />,
    [],
  );

  return (
    <View style={styles.root}>
      <FlashList
        ListHeaderComponent={
          <>
            <TransactionInformation
              hash={hash}
              memo={memo}
              estimatingFee={estimatingFee}
              fee={txFex}
              dateTime={dateTime}
              success={success}
            />
            <Spacer paddingVertical={16} />
            <Typography.SemiBold16>{t('messages')}</Typography.SemiBold16>
            <Spacer paddingVertical={8} />
          </>
        }
        data={messages}
        renderItem={renderMessages}
        estimatedItemSize={202}
      />
    </View>
  );
};

export default TransactionDetails;
