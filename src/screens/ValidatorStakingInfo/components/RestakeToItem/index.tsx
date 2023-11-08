import React from 'react';
import { Redelegation } from 'types/distribution';
import useValidator from 'hooks/validator/useValidator';
import { View } from 'react-native';
import AvatarImage from 'components/AvatarImage';
import ThemedContentLoader from 'components/ThemedContentLoader';
import { getValidatorAvatar, getValidatorName } from 'lib/ValidatorUtils';
import Typography from 'components/Typography';
import { Circle, Rect } from 'react-content-loader/native';
import { formatCoin } from 'lib/FormatUtils';
import { useCurrentChainInfo } from '@recoil/settings';
import { format } from 'date-fns';
import Spacer from 'components/Spacer';
import { useTranslation } from 'react-i18next';
import useStyles from './useStyles';

export interface RestakeToItemParams {
  /**
   * Redelegation to be displayed.
   */
  readonly redelegation: Redelegation;
}

/**
 * Component that shows the following information of a `Redelegation` object:
 * - Amount of coins being redelegate;
 * - Date of when the redelegation completes.
 */
const RestakeToItem: React.FC<RestakeToItemParams> = ({ redelegation }) => {
  const { t } = useTranslation();
  const chainInfo = useCurrentChainInfo();
  const styles = useStyles();

  const { data: validator, loading: loadingValidator } = useValidator(
    redelegation.validatorDstAddress,
  );

  // -------- DATA --------

  const redelegatedAmount = React.useMemo(
    () =>
      formatCoin({ amount: redelegation.balance, denom: chainInfo.stakeCurrency.coinMinimalDenom }),
    [chainInfo, redelegation.balance],
  );

  const redelegationEndDate = React.useMemo(
    () => format(redelegation.completionTime, 'EEEE do MMMM, HH:mm'),
    [redelegation.completionTime],
  );

  return (
    <View style={styles.root}>
      {/* Validator details */}
      {loadingValidator ? (
        <ThemedContentLoader>
          <Circle r={24} x={24} y={24} />
          <Rect x={32} width={200} height={22} />
        </ThemedContentLoader>
      ) : (
        <View style={styles.validatorInfoContainer}>
          <AvatarImage source={getValidatorAvatar(validator!)} size={28} />
          <Spacer paddingHorizontal={8} />
          <Typography.Body1>{getValidatorName(validator!)}</Typography.Body1>
        </View>
      )}

      {/* Amount being redelegate */}
      <View style={styles.inlineFieldsContainer}>
        <Typography.Regular16>{t('amount')}:</Typography.Regular16>
        <Typography.Regular16 style={styles.fieldValue}>{redelegatedAmount}</Typography.Regular16>
      </View>

      {/* Completion date */}
      <View style={styles.inlineFieldsContainer}>
        <Typography.Regular16>{t('completition date')}:</Typography.Regular16>
        <Typography.Regular16 style={styles.fieldValue}>{redelegationEndDate}</Typography.Regular16>
      </View>
    </View>
  );
};

export default RestakeToItem;
