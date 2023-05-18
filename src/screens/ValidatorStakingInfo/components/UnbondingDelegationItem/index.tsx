import React from 'react';
import { UnbondingDelegation } from 'types/distribution';
import { View } from 'react-native';
import { useCurrentChainInfo } from '@recoil/settings';
import { formatCoin } from 'lib/FormatUtils';
import { format } from 'date-fns';
import Typography from 'components/Typography';
import useStyles from './useStyles';

export interface UnbondingDelegationItemParams {
  readonly unbondingDelegation: UnbondingDelegation;
}

const UnbondingDelegationItem: React.FC<UnbondingDelegationItemParams> = ({
  unbondingDelegation,
}) => {
  const chainInfo = useCurrentChainInfo();
  const styles = useStyles();

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
    () => format(unbondingDelegation.completionTime, 'yyyy-MM-dd HH:mm'),
    [unbondingDelegation.completionTime],
  );

  return (
    <View style={styles.root}>
      <Typography.Body1>{unbondingAmount}</Typography.Body1>
      <Typography.Body style={styles.unbondingCompletionText}>
        {unbondingCompletitionTime}
      </Typography.Body>
    </View>
  );
};

export default UnbondingDelegationItem;
