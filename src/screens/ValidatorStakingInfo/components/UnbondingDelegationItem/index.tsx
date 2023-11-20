import React from 'react';
import { UnbondingDelegation } from 'types/distribution';
import { View } from 'react-native';
import { useCurrentChainInfo } from '@recoil/settings';
import { formatCoin } from 'lib/FormatUtils';
import { format } from 'date-fns';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';

interface UnbondingDelegationItemParams {
  /**
   * Unbonding delegation to be displayed.
   */
  readonly unbondingDelegation: UnbondingDelegation;
}

/**
 * Component the following information of a `UnbondingDelegation` object:
 * - Amount of coins being unbonded.
 * - Date of when the unbond procedure completes.
 */
const UnbondingDelegationItem: React.FC<UnbondingDelegationItemParams> = ({
  unbondingDelegation,
}) => {
  const { t } = useTranslation();
  const chainInfo = useCurrentChainInfo();

  // -------- DATA --------

  const unbondingAmount = React.useMemo(
    () =>
      formatCoin({
        amount: unbondingDelegation.balance,
        denom: chainInfo.stakeCurrency.coinMinimalDenom,
      }),
    [chainInfo, unbondingDelegation.balance],
  );

  const unbondingCompletitionTime = React.useMemo(
    () => format(unbondingDelegation.completionTime, 'EEEE do MMMM, HH:mm'),
    [unbondingDelegation.completionTime],
  );

  return (
    <View>
      {/* Amount being redelegate */}
      <Typography.Regular16>
        {t('amount')}: {unbondingAmount}
      </Typography.Regular16>

      {/* Completion date */}
      <Typography.Regular16>
        {t('completition date')}: {unbondingCompletitionTime}
      </Typography.Regular16>
    </View>
  );
};

export default UnbondingDelegationItem;
