import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import React from 'react';
import ROUTES from 'navigation/routes';

/**
 * Hook that provides a function that let the user
 * select a validator and then stake some coins toward the selected validator.
 */
const useStakeFlow = () => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  return React.useCallback(() => {
    navigation.navigate(ROUTES.SELECT_VALIDATOR, {
      onValidatorSelected: (validator) => {
        navigation.navigate(ROUTES.VALIDATOR_DETAILS, {
          validator,
        });
      },
    });
  }, [navigation]);
};

export default useStakeFlow;
