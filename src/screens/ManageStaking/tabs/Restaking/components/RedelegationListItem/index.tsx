import { Redelegation } from 'types/distribution';
import React from 'react';
import useValidator from 'hooks/validator/useValidator';
import { useCurrentChainInfo } from '@recoil/settings';
import { formatCoin } from 'lib/FormatUtils';
import { coin } from '@cosmjs/amino';
import { View } from 'react-native';
import ValidatorNameWithStatus from 'components/ValidatorNameWithStatus';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import Spacer from 'components/Spacer';
import { differenceInDays, format } from 'date-fns';
import useStyles from './useStyles';

export interface RedelegationListItemProps {
  /**
   * Redelegation to be displayed.
   */
  readonly redelegation: Redelegation;
}

/**
 * Component that shows the following information of a `Redelegation` object:
 * - Validator from which the delegation will be redelegated;
 * - Validator to which the delegation will be redelegated;
 * - Amount that is being redelegated;
 * - Date time of when the redelegation completes.
 */
const RedelegationListItem: React.FC<RedelegationListItemProps> = ({ redelegation }) => {
  const styles = useStyles();
  const { t } = useTranslation('restaking');
  const chainInfo = useCurrentChainInfo();
  const { data: srcValidator, loading: loadingSrcValidator } = useValidator(
    redelegation.validatorSrcAddress,
  );
  const { data: destValidator, loading: loadingDestValidator } = useValidator(
    redelegation.validatorDstAddress,
  );
  const amount = React.useMemo(
    () => formatCoin(coin(redelegation.balance, chainInfo.stakeCurrency.coinMinimalDenom)),
    [redelegation.balance, chainInfo.stakeCurrency.coinMinimalDenom],
  );

  return (
    <View style={styles.root}>
      {/* From validator info */}
      <Typography.Body>{t('transaction:from')}</Typography.Body>
      <ValidatorNameWithStatus loading={loadingSrcValidator} validator={srcValidator} />

      <Spacer paddingVertical={8} />

      {/* To validator info */}
      <Typography.Body>{t('transaction:to')}</Typography.Body>
      <ValidatorNameWithStatus loading={loadingDestValidator} validator={destValidator} />

      <Spacer paddingVertical={8} />

      {/* Restake amount */}
      <View style={styles.dataField}>
        <Typography.Body>{t('restaking')}</Typography.Body>
        <Typography.Body>{amount}</Typography.Body>
      </View>

      {/* Restake completion info */}
      <View style={styles.dataField}>
        <Typography.Body>{t('staking:expected delivery')}</Typography.Body>
        <View style={styles.dataFieldMultipleValue}>
          <Typography.Body>{format(redelegation.completionTime, 'dd MMM, hh:mm')}</Typography.Body>
          <Typography.Body style={styles.daysToComplete}>
            {t('common:in days', {
              count: differenceInDays(redelegation.completionTime, new Date()),
            })}
          </Typography.Body>
        </View>
      </View>
    </View>
  );
};

export default RedelegationListItem;
