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
    () => format(redelegation.completionTime, 'yyyy-MM-dd HH:mm'),
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

      {/* Redelegation information */}
      <View style={styles.valuesContainer}>
        <Typography.Body1>{redelegatedAmount}</Typography.Body1>
        <Typography.Body style={styles.redelegationCompletionText}>
          {redelegationEndDate}
        </Typography.Body>
      </View>
    </View>
  );
};

export default RestakeToItem;
