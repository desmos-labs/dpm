import React from 'react';
import { UnbondingDelegation } from 'types/distribution';
import { TouchableOpacity, View } from 'react-native';
import Typography from 'components/Typography';
import { formatCoin } from 'lib/FormatUtils';
import useValidator from 'hooks/validator/useValidator';
import Spacer from 'components/Spacer';
import ValidatorNameWithStatus from 'components/ValidatorNameWithStatus';
import { useTranslation } from 'react-i18next';
import { useCurrentChainInfo } from '@recoil/settings';
import { coin } from '@cosmjs/amino';
import { differenceInDays, format } from 'date-fns';
import useStyles from './useStyles';

export interface UnbondingDelegationListItemProps {
  readonly unbondingDelegation: UnbondingDelegation;
  readonly onPress?: (delegation: UnbondingDelegation) => any;
}

const UnbondingDelegationListItem: React.FC<UnbondingDelegationListItemProps> = ({
  unbondingDelegation,
  onPress,
}) => {
  const styles = useStyles();
  const { t } = useTranslation('staking');

  // -------- HOOKS --------

  const chainInfo = useCurrentChainInfo();

  const { data: validator, loading: loadingValidator } = useValidator(
    unbondingDelegation.validatorAddress,
  );

  // -------- DATA ---------

  const coinAmount = React.useMemo(
    () => coin(unbondingDelegation.balance, chainInfo.stakeCurrency.coinMinimalDenom),
    [chainInfo.stakeCurrency.coinMinimalDenom, unbondingDelegation.balance],
  );

  // -------- CALLBACKS --------

  const onUnbondingDelegationPress = React.useCallback(() => {
    if (onPress !== undefined) {
      onPress(unbondingDelegation);
    }
  }, [unbondingDelegation, onPress]);

  return (
    <TouchableOpacity onPress={onUnbondingDelegationPress} disabled={onPress === undefined}>
      <View style={styles.root}>
        {/* Validator details */}
        <ValidatorNameWithStatus validator={validator} loading={loadingValidator} />
        <Spacer paddingVertical={8} />

        {/* Amount of coins that the user unbonded from the validator */}
        <View style={styles.dataField}>
          <Typography.Body>{t('unbonding')}</Typography.Body>
          <Typography.Body>{formatCoin(coinAmount)}</Typography.Body>
        </View>

        {/* Unbond completion info */}
        <View style={styles.dataField}>
          <Typography.Body>{t('expected delivery')}</Typography.Body>
          <View style={styles.dataFieldMultipleValue}>
            <Typography.Body>
              {format(unbondingDelegation.completionTime, 'dd MMM, hh:mm')}
            </Typography.Body>
            <Typography.Body style={styles.daysToComplete}>
              {t('common:in days', {
                count: differenceInDays(unbondingDelegation.completionTime, new Date()),
              })}
            </Typography.Body>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UnbondingDelegationListItem;
