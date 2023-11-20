import React from 'react';
import { Image, View } from 'react-native';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import Spacer from 'components/Spacer';
import { failIcon, successIcon } from 'assets/images';
import useStyles from './useStyles';
import TransactionInfoField from '../TransactionInfoField';

interface TransactionInformationProps {
  readonly hash?: string;
  readonly dateTime?: Date;
  /**
   * True if the fees are still being estimated.
   */
  readonly estimatingFee?: boolean;
  readonly fee?: string;
  readonly success?: boolean;
  readonly memo?: string;
}

const TransactionInformation: React.FC<TransactionInformationProps> = ({
  hash,
  dateTime,
  estimatingFee,
  fee,
  success,
  memo,
}) => {
  const styles = useStyles();
  const { t } = useTranslation('transaction');

  // -------- VARIABLES --------

  const transactionTime = React.useMemo(
    () => (dateTime ? format(new Date(dateTime), 'MMM dd,yyyy HH:mm:ss') : undefined),
    [dateTime],
  );

  const txMemo = React.useMemo(() => {
    if (memo === undefined || memo.length === 0) {
      return '-';
    }
    return memo;
  }, [memo]);

  return (
    <View>
      {/* Header */}
      <Typography.SemiBold18>{t('tx details')}</Typography.SemiBold18>

      <View style={styles.infoContainer}>
        {/* Transaction hash */}
        {hash !== undefined && (
          <>
            <TransactionInfoField label={t('hash')} value={hash} valueSelectable />
            <Spacer paddingVertical={8} />
          </>
        )}

        {/* Transaction time */}
        {transactionTime !== undefined && (
          <>
            <TransactionInfoField label={t('time')} value={transactionTime} />
            <Spacer paddingVertical={8} />
          </>
        )}

        {/* Transaction fee */}
        <TransactionInfoField label={t('fee')} value={fee} loading={estimatingFee} />
        <Spacer paddingVertical={8} />

        {/* Transaction status */}
        {success !== undefined && (
          <>
            <Typography.Regular14>{t('status')}</Typography.Regular14>
            <Spacer paddingVertical={4} />
            <View style={styles.txStatus}>
              <Image style={styles.txStatusIcon} source={success ? successIcon : failIcon} />
              <Typography.Regular14 style={success ? styles.txSuccessLabel : styles.txFailLabel}>
                {success ? t('common:success') : t('common:fail')}
              </Typography.Regular14>
            </View>
            <Spacer paddingVertical={8} />
          </>
        )}

        {/* Transaction memo */}
        <TransactionInfoField label={t('memo')} value={txMemo} />
      </View>
    </View>
  );
};

export default TransactionInformation;
