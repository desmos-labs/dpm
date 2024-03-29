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

interface UnbondingDelegationListItemProps {
  /**
   * Delegations to be displayed.
   */
  readonly unbondingDelegation: UnbondingDelegation;
  /**
   * Callback called if the user press on the component.
   */
  readonly onPress?: (delegation: UnbondingDelegation) => any;
}

/**
 * Component that shows the following information of a `UnbondingDelegation` object:
 * - Validator from which the tokens are being unbonded;
 * - Amount of tokens being unbonded;
 * - Date time of when the unbond operation completes.
 */
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
        <Typography.Body>
          {t('amount', { ns: 'common' })}: {formatCoin(coinAmount)}
        </Typography.Body>

        {/* Unbond completion info */}
        <Typography.Body>
          {t('completition time', { ns: 'common' })}:{' '}
          {format(unbondingDelegation.completionTime, 'EEEE do MMMM, HH:mm')} {'('}
          {t('days from now', {
            ns: 'common',
            count: differenceInDays(unbondingDelegation.completionTime, new Date()),
          })}
          {')'}
        </Typography.Body>
      </View>
    </TouchableOpacity>
  );
};

export default UnbondingDelegationListItem;
