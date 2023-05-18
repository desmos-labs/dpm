import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import TxMemoInput from 'components/TxMemoInput';
import Flexible from 'components/Flexible';
import Button from 'components/Button';
import useValidator from 'hooks/validator/useValidator';

export interface RedelegateParams {
  /**
   * Validator operator address from which the tokens will be
   * redelegated.
   */
  readonly fromValidatorAddress: string;
  /**
   * Validator operator address to which the tokens will be redelegated.
   */
  readonly toValidatorAddress: string;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.REDELEGATE>;

const Redelegate: React.FC<NavProps> = (props) => {
  const { fromValidatorAddress, toValidatorAddress } = props.route.params;
  const { t } = useTranslation();

  // -------- HOOKS --------
  const { data: fromValidator, loading: lodingfromValidator } = useValidator(fromValidatorAddress);
  const { data: toValidator, loading: loadingToValidator } = useValidator(toValidatorAddress);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} title={t('staking:restake')} />}>
      <Typography.Body1>{t('staking:restake from')}</Typography.Body1>
      <Typography.Body1>{t('staking:restake to')}</Typography.Body1>

      {/* Tx memo input */}
      <Typography.Body1>{t('tx:memo')}</Typography.Body1>
      <TxMemoInput />

      <Flexible.Padding flex={1} />

      <Button mode={'contained'}>{t('common:next')}</Button>
    </StyledSafeAreaView>
  );
};

export default Redelegate;
