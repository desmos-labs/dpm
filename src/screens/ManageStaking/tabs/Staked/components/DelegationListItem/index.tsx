import React from 'react';
import { Delegation } from 'types/distribution';
import { View } from 'react-native';
import Typography from 'components/Typography';
import { formatCoins } from 'lib/FormatUtils';
import useValidator from 'hooks/validator/useValidator';
import AvatarImage from 'components/AvatarImage';
import { getValidatorAvatar, getValidatorName } from 'lib/ValidatorUtils';
import { defaultProfilePicture } from 'assets/images';
import TypographyContentLoaders from 'components/ContentLoaders/Typography';
import Spacer from 'components/Spacer';
import useValidatorRewards from 'hooks/staking/useValidatorRewards';
import useStyles from './useStyles';

export interface DelegationListItemProps {
  readonly delegation: Delegation;
}

const DelegationListItem: React.FC<DelegationListItemProps> = ({ delegation }) => {
  const styles = useStyles();
  const {
    data: validator,
    loading: loadingValidator,
    error: errorValidator,
  } = useValidator(delegation.validatorAddress);
  const { data: rewards, loading: loadingRewards } = useValidatorRewards(
    delegation.validatorAddress,
  );

  return (
    <View style={styles.root}>
      {errorValidator === undefined && (
        <View style={styles.validatorDetailsContainer}>
          <AvatarImage
            source={validator ? getValidatorAvatar(validator) : defaultProfilePicture}
            loading={loadingValidator}
            size={40}
          />
          <Spacer paddingHorizontal={6} />
          <View>
            {loadingValidator ? (
              <TypographyContentLoaders.Body width={100} />
            ) : (
              <Typography.Body>{getValidatorName(validator!)}</Typography.Body>
            )}
            {loadingValidator ? (
              <TypographyContentLoaders.Body width={100} />
            ) : (
              <Typography.Body>{validator!.status}</Typography.Body>
            )}
          </View>
        </View>
      )}

      <Spacer paddingVertical={8} />

      <View style={styles.dataField}>
        <Typography.Body>Staked</Typography.Body>
        <Typography.Body>{formatCoins(delegation.coins)}</Typography.Body>
      </View>
      <View style={styles.dataField}>
        <Typography.Body>Rewards</Typography.Body>
        {loadingRewards ? (
          <TypographyContentLoaders.Body width={200} />
        ) : (
          <Typography.Body>{formatCoins(rewards)}</Typography.Body>
        )}
      </View>
    </View>
  );
};

export default DelegationListItem;
