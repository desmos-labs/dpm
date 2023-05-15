import React from 'react';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import Typography from 'components/Typography';
import useTotalDelegatedAmount from 'hooks/staking/useTotalDelegatedAmount';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { formatCoins } from 'lib/FormatUtils';
import TypographyContentLoaders from 'components/ContentLoaders/Typography';
import Spacer from 'components/Spacer';
import useStyles from './useStyles';

const StakedTab: React.FC = () => {
  const { t } = useTranslation('manageStaking');
  const styles = useStyles();
  const {
    totalDelegated,
    loading: totalDelegatedLoading,
    error: totalDelegatedError,
  } = useTotalDelegatedAmount();

  return (
    <StyledSafeAreaView>
      {/* Total staked amount */}
      {totalDelegatedError === undefined && (
        <View style={styles.totalStaked}>
          <Typography.Body>{t('total staked')}</Typography.Body>
          <Spacer paddingHorizontal={8} />
          {totalDelegatedLoading ? (
            <TypographyContentLoaders.Body width={200} />
          ) : (
            <Typography.Body style={{ fontWeight: 'bold' }}>
              {formatCoins(totalDelegated)}
            </Typography.Body>
          )}
        </View>
      )}
    </StyledSafeAreaView>
  );
};

export default StakedTab;
