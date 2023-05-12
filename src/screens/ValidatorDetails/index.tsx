import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { Validator } from 'types/validator';
import React, { FC } from 'react';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { getValidatorBio } from 'lib/ValidatorUtils';
import Markdown from 'react-native-markdown-display';
import { ScrollView } from 'react-native';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import useValidatorStakingApr from 'hooks/validator/useValidatorStakingApr';
import useStyles from './useStyles';
import DetailsHeader from './components/DetailsHeader';
import ValidatorInfoField from './components/ValidatorInfoField';

export type ValidatorDetailsParams = {
  validator: Validator;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.VALIDATOR_DETAILS>;

const ValidatorDetails: FC<NavProps> = (props) => {
  const { validator } = props.route.params;
  const styles = useStyles();
  const { t } = useTranslation('validatorDetails');
  const { data: apr, loading: aprLoading, error: aprError } = useValidatorStakingApr(validator);

  const validatorDescription = React.useMemo(
    () =>
      // Replace all the <br/> with a new line because the markdown component
      // don't handle them correctly.
      getValidatorBio(validator)?.replace(/<br\/>/g, '\n') ?? '',
    [validator],
  );

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} />}>
      {/* Validator avatar and online status */}
      <DetailsHeader validator={validator} />

      {/* Validator description */}
      <Markdown>{validatorDescription}</Markdown>

      {/* Validator info */}
      <ScrollView style={styles.infoContainer}>
        <ValidatorInfoField label={t('website')} value={validator.website ?? 'N/A'} />
        <ValidatorInfoField
          label={t('voting power')}
          extraInfo={`${validator.votingPower}/${validator.votingPower}`}
          value={`${validator.votingPower}`}
        />
        <ValidatorInfoField label={t('commission')} value={`${validator.commission * 100}%`} />
        <ValidatorInfoField
          label={t('apr')}
          loading={aprLoading}
          value={aprError ? t('error loading apr') : `${apr}%`}
        />
        <ValidatorInfoField label={t('no. of delegator')} value={''} />
        <ValidatorInfoField label={t('last seen')} value={''} />
      </ScrollView>

      <Button style={styles.stakeButton} mode={'contained'}>
        Stake
      </Button>
    </StyledSafeAreaView>
  );
};

export default ValidatorDetails;
