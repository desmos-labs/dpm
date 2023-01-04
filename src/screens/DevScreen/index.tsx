import StyledSafeAreaView from 'components/StyledSafeAreaView';
import Button from 'components/Button';
import React, { FC, useCallback } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.DEV_SCREEN>;

const DevScreen: FC<NavProps> = ({navigation}) => {

  const navigateToLandingPage = useCallback(() => {
    navigation.navigate({
      name: ROUTES.LANDING,
      params: undefined,
    });
  }, [navigation]);

  return <StyledSafeAreaView>
    <Button
      mode="contained"
      onPress={navigateToLandingPage}
    >
      Go to landing page
    </Button>
  </StyledSafeAreaView>;
};

export default DevScreen;
