import React from 'react';
import { Delegation } from 'types/distribution';
import { TouchableOpacity, View } from 'react-native';
import Typography from 'components/Typography';
import { formatCoins } from 'lib/FormatUtils';
import useValidator from 'hooks/validator/useValidator';
import TypographyContentLoaders from 'components/ContentLoaders/Typography';
import Spacer from 'components/Spacer';
import useValidatorRewards from 'hooks/staking/useValidatorRewards';
import ValidatorNameWithStatus from 'components/ValidatorNameWithStatus';
import { useTranslation } from 'react-i18next';
import useStyles from './useStyles';

export interface DelegationListItemProps {
  readonly delegation: Delegation;
  readonly onPress?: (delegation: Delegation) => any;
}

const DelegationListItem: React.FC<DelegationListItemProps> = ({ delegation, onPress }) => {
  const styles = useStyles();
  const { t } = useTranslation('staking');
  const { data: validator, loading: loadingValidator } = useValidator(delegation.validatorAddress);
  const { data: rewards, loading: loadingRewards } = useValidatorRewards(
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
        <ValidatorNameWithStatus validator={validator} loading={loadingValidator} />
        <Spacer paddingVertical={8} />

        <View style={styles.dataField}>
          <Typography.Body>{t('staked')}</Typography.Body>
          <Typography.Body>{formatCoins(delegation.coins)}</Typography.Body>
        </View>
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
