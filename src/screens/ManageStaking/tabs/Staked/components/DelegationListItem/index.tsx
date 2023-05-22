import React from 'react';
import { Delegation } from 'types/distribution';
import { TouchableOpacity, View } from 'react-native';
import Typography from 'components/Typography';
import { formatCoins } from 'lib/FormatUtils';
import useValidator from 'hooks/validator/useValidator';
import TypographyContentLoaders from 'components/ContentLoaders/Typography';
import Spacer from 'components/Spacer';
import useAccountValidatorPendingStakingRewards from 'hooks/staking/useAccountValidatorPendingStakingRewards';
import ValidatorNameWithStatus from 'components/ValidatorNameWithStatus';
import { useTranslation } from 'react-i18next';
import useStyles from './useStyles';

export interface DelegationListItemProps {
  /**
   * Delegation object to display.
   */
  readonly delegation: Delegation;
  /**
   * Callback that is called when the user press on this component.
   */
  readonly onPress?: (delegation: Delegation) => any;
}

/**
 * Component that shows the following information of a `Delegation` object:
 * - Amount of staked coins torward the validator;
 * - Amount of staking rewards that the user can claim.
 */
const DelegationListItem: React.FC<DelegationListItemProps> = ({ delegation, onPress }) => {
  const styles = useStyles();
  const { t } = useTranslation('staking');
  const { data: validator, loading: loadingValidator } = useValidator(delegation.validatorAddress);
  const { data: rewards, loading: loadingRewards } = useAccountValidatorPendingStakingRewards(
    delegation.validatorAddress,
  );

  const onDelegationPress = React.useCallback(() => {
    if (onPress !== undefined) {
      onPress(delegation);
    }
  }, [delegation, onPress]);

  return (
    <TouchableOpacity onPress={onDelegationPress}>
      <View style={styles.root}>
        {/* Validator details */}
        <ValidatorNameWithStatus validator={validator} loading={loadingValidator} />
        <Spacer paddingVertical={8} />

        {/* Amount of coins that the user staked torward the validator */}
        <View style={styles.dataField}>
          <Typography.Body>{t('staked')}</Typography.Body>
          <Typography.Body>{formatCoins(delegation.coins)}</Typography.Body>
        </View>

        {/* Amount of coins that the user can claim from this validator */}
        <View style={styles.dataField}>
          <Typography.Body>{t('rewards')}</Typography.Body>
          {loadingRewards ? (
            <TypographyContentLoaders.Body width={200} />
          ) : (
            <Typography.Body>{formatCoins(rewards)}</Typography.Body>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DelegationListItem;
