import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { Validator } from 'types/validator';
import React, { FC } from 'react';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { getValidatorBio } from 'lib/ValidatorUtils';
import Markdown from 'react-native-markdown-display';
import DetailsHeader from './components/DetailsHeader';

export type ValidatorDetailsParams = {
  validator: Validator;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.VALIDATOR_DETAILS>;

const ValidatorDetails: FC<NavProps> = (props) => {
  const { validator } = props.route.params;

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} />}>
      {/* Validator avatar and online status */}
      <DetailsHeader validator={validator} />

      {/* Validator description */}
      <Markdown>{getValidatorBio(validator)?.replace(/<br\/>/g, '\n') ?? ''}</Markdown>
    </StyledSafeAreaView>
  );
};

export default ValidatorDetails;
